'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import SocialShare from '@/components/SocialShare/SocialShare';
import FloatingShareButton from '@/components/SocialShare/FloatingShareButton';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/Home/TopSales/components/Productcard';

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${params.id}`);
        const productData = response.data.product || response.data;
        setProduct(productData);
        setSelectedImage(productData.image);
        fetchRelatedProducts(productData.category, productData._id || productData.id);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category, currentProductId) => {
      try {
        const response = await axiosInstance.get('/products');
        const allProducts = response.data.products || [];
        const related = allProducts
          .filter(p => {
            const pId = p._id || p.id;
            return p.category === category && pId !== currentProductId;
          })
          .slice(0, 8);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product, 1);
    Swal.fire({
      title: 'Added to Cart!',
      text: `${quantity} ${product.name}(s) has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#000',
      showConfirmButton: true,
      confirmButtonText: 'Go to Cart',
      showCancelButton: true,
      cancelButtonText: 'Continue Shopping'
    }).then((result) => { if (result.isConfirmed) router.push('/cart'); });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      Swal.fire({ icon: 'info', title: 'Removed from Wishlist', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
    } else {
      addToWishlist(product);
      Swal.fire({ icon: 'success', title: 'Added to Wishlist!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product, 1);
    const { value: formValues } = await Swal.fire({
      title: '<strong>Checkout - Enter Your Information</strong>',
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="margin-bottom: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Product:</span><strong>${product.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Quantity:</span><strong>${quantity}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Price:</span><strong>৳${product.price}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #d1d5db; margin-top: 10px;">
              <span style="color: #1f2937; font-weight: 600;">Total Amount:</span>
              <strong style="color: #1f2937; font-size: 18px;">৳${(product.price * quantity).toFixed(2)}</strong>
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">Full Name *</label>
            <input id="swal-name" class="swal2-input" placeholder="Enter your full name" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">Email Address *</label>
            <input id="swal-email" class="swal2-input" placeholder="your@email.com" type="email" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">Phone Number *</label>
            <input id="swal-phone" class="swal2-input" placeholder="+880 1XXX-XXXXXX" type="tel" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">Delivery Address *</label>
            <textarea id="swal-address" class="swal2-textarea" placeholder="Enter your complete delivery address" style="margin: 0; width: 100%; min-height: 80px;"></textarea>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 500;">Special Instructions (Optional)</label>
            <textarea id="swal-notes" class="swal2-textarea" placeholder="Any special delivery instructions?" style="margin: 0; width: 100%; min-height: 60px;"></textarea>
          </div>
        </div>
      `,
      width: '600px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Place Order',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const phone = document.getElementById('swal-phone').value.trim();
        const address = document.getElementById('swal-address').value.trim();
        const notes = document.getElementById('swal-notes').value.trim();
        if (!name || !email || !phone || !address) { Swal.showValidationMessage('Please fill in all required fields (*)'); return false; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { Swal.showValidationMessage('Please enter a valid email address'); return false; }
        if (phone.length < 10) { Swal.showValidationMessage('Please enter a valid phone number'); return false; }
        return { name, email, phone, address, notes };
      }
    });

    if (formValues) {
      try {
        Swal.fire({ title: 'Processing Order...', html: 'Please wait while we process your order', allowOutsideClick: false, allowEscapeKey: false, showConfirmButton: false, willOpen: () => { Swal.showLoading(); } });
        const orderData = {
          customerInfo: formValues,
          items: [{ productId: product._id || product.id, name: product.name, price: product.price, quantity, image: product.image }],
          totalAmount: product.price * quantity,
          status: 'pending',
          orderDate: new Date().toISOString()
        };
        const response = await axiosInstance.post('/orders', orderData);
        await Swal.fire({
          title: '<strong>Order Placed Successfully!</strong>',
          html: `<div style="text-align:left;padding:10px;"><p style="color:#059669;font-weight:500;margin-bottom:15px;">Thank you for your order!</p><div style="background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:15px;"><div style="margin-bottom:8px;"><strong>Order ID:</strong> ${response.data.order?._id || 'Processing'}</div><div style="margin-bottom:8px;"><strong>Customer:</strong> ${formValues.name}</div><div style="margin-bottom:8px;"><strong>Total:</strong> ৳${(product.price * quantity).toFixed(2)}</div></div><p style="color:#6b7280;font-size:14px;">📧 Confirmation sent to <strong>${formValues.email}</strong></p></div>`,
          icon: 'success',
          confirmButtonColor: '#000',
          confirmButtonText: 'Continue Shopping',
          showCancelButton: true,
          cancelButtonText: 'View Cart',
          cancelButtonColor: '#059669'
        }).then((result) => { if (result.dismiss === Swal.DismissReason.cancel) router.push('/cart'); else router.push('/'); });
      } catch (error) {
        console.error('Error placing order:', error);
        Swal.fire({ title: 'Order Failed', html: `<p style="color:#dc2626;">${error.response?.data?.message || 'Failed to place order.'}</p>`, icon: 'error', confirmButtonColor: '#000', confirmButtonText: 'Try Again' });
      }
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#aaa]">Loading product</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6">
        <p className="text-2xl font-light text-[#1a1a1a] tracking-tight">Product not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-xs font-semibold tracking-[0.12em] uppercase border border-[#1a1a1a] px-6 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-[#e8e6e0] bg-white">
        <div className="container mx-auto px-6 lg:px-8 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#999] hover:text-[#1a1a1a] transition-colors text-[11px] font-medium tracking-[0.1em] uppercase"
          >
            <FaArrowLeft size={9} />
            Back
          </button>
          <span className="text-[#dedad3]">·</span>
          <nav className="flex items-center gap-2 text-[11px] text-[#aaa] tracking-[0.04em]">
            <button onClick={() => router.push('/')} className="hover:text-[#1a1a1a] transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/')} className="hover:text-[#1a1a1a] transition-colors">Products</button>
            <span>/</span>
            <span className="text-[#1a1a1a] font-medium truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Section ── */}
      <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── LEFT: Images ── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div
              className="relative w-full bg-[#f0ede6] border border-[#e8e6e0] overflow-hidden cursor-crosshair"
              style={{ height: '520px' }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-cover"
                style={{
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: isZoomed ? 'none' : 'transform 0.35s ease',
                }}
                priority
              />
              {/* Discount badge */}
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[10px] font-semibold px-2.5 py-1 tracking-[0.08em]">
                  −{discountPercent}%
                </span>
              )}
              {/* Out of stock overlay */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#888] border border-[#ccc] px-5 py-2.5 bg-white/80">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative h-20 bg-[#f0ede6] border overflow-hidden cursor-pointer transition-all ${
                    selectedImage === product.image ? 'border-[#1a1a1a]' : 'border-[#e8e6e0] hover:border-[#aaa]'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 bg-[#f0ede6] border overflow-hidden cursor-pointer transition-all ${
                      selectedImage === img ? 'border-[#1a1a1a]' : 'border-[#e8e6e0] hover:border-[#aaa]'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex flex-col gap-6">

            {/* Category pill */}
            {product.category && (
              <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#999]">
                {product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}
              </span>
            )}

            {/* Name */}
            <h1
              className="text-4xl lg:text-5xl font-semibold leading-tight text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.name}
            </h1>

            {/* Rating + SKU */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-amber-400" size={12} />)}
                <span className="text-[12px] text-[#aaa] ml-1.5">4.5 · 128 reviews</span>
              </div>
              {product.sku && (
                <span className="text-[11px] text-[#aaa] tracking-[0.04em]">
                  SKU <span className="text-[#1a1a1a] font-medium">{product.sku}</span>
                </span>
              )}
            </div>

            <div className="border-t border-[#e8e6e0]" />

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ৳{product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#bbb] line-through font-light">
                    ৳{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-[12px] font-semibold text-[#b94040] tracking-[0.04em]">
                    −{discountPercent}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[12px] font-medium text-[#1a1a1a]">In Stock</span>
                  <span className="text-[12px] text-[#aaa]">— {product.stock} available</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span className="text-[12px] font-medium text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Feature highlight */}
            {product.feature && (
              <div className="bg-white border border-[#e8e6e0] px-4 py-3 text-[12.5px] text-[#555] leading-relaxed">
                <span className="font-semibold text-[#1a1a1a]">Highlight — </span>
                {product.feature}
              </div>
            )}

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                ['Category', product.category],
                product.subcategory && ['Subcategory', product.subcategory],
                product.size && ['Size', product.size],
                product.color && ['Color', product.color],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center border-b border-[#f0ede6] pb-2">
                  <span className="text-[11px] text-[#aaa] uppercase tracking-[0.08em]">{label}</span>
                  <span className="text-[12.5px] font-medium text-[#1a1a1a]">{value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e8e6e0]" />

            {/* Quantity */}
            <div className="flex items-center gap-5">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#555]">Quantity</span>
              <div className="flex items-center border border-[#1a1a1a]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f4f0] transition-colors text-lg font-light"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-[#1a1a1a] font-semibold text-sm border-x border-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f4f0] transition-colors text-lg font-light"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart size={11} />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`w-14 flex items-center justify-center border transition-colors ${
                    inWishlist
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                      : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <FaHeart size={12} />
                </button>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 border border-[#1a1a1a] text-[#1a1a1a] text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:border-[#dedad3] disabled:text-[#ccc] disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <SocialShare product={product} />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 pt-1">
              {['Free Shipping', '30-Day Returns', 'Quality Guarantee'].map((badge) => (
                <span key={badge} className="text-[10px] text-[#999] tracking-[0.06em] flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Description & Tags ── */}
        <div className="mt-16 border-t border-[#e8e6e0] pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h3
              className="text-2xl font-semibold text-[#1a1a1a] mb-5 tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Product Description
            </h3>
            <p className="text-[13.5px] text-[#777] leading-[1.9]">{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <h3
                className="text-2xl font-semibold text-[#1a1a1a] mb-5 tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="border border-[#dedad3] text-[#888] text-[11px] px-3 py-1.5 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-default tracking-[0.04em]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#e8e6e0] bg-[#f5f4f0] py-14">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-baseline gap-4 mb-8">
              <h2
                className="text-3xl font-semibold text-[#1a1a1a] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Related Products
              </h2>
              <span className="text-[11px] text-[#aaa] tracking-[0.08em] uppercase">{relatedProducts.length} items</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={relatedProduct}
                  onClick={() => router.push(`/products/${relatedProduct._id || relatedProduct.id}`)}
                  onQuickView={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {product && <FloatingShareButton product={product} />}
    </div>
  );
};

export default ProductDetailsPage;