'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
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
        // Server returns: { success: true, message: "...", product: {...} }
        const productData = response.data.product || response.data;
        setProduct(productData);
        setSelectedImage(productData.image);
        
        // Fetch related products based on category
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
        
        // Filter products by same category, excluding current product
        const related = allProducts
          .filter(p => {
            const pId = p._id || p.id;
            return p.category === category && pId !== currentProductId;
          })
          .slice(0, 8); // Show maximum 8 related products
        
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add product to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 1);
    }

    // Show success message
    Swal.fire({
      title: 'Added to Cart!',
      text: `${quantity} ${product.name}(s) has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#000',
      showConfirmButton: true,
      confirmButtonText: 'Go to Cart',
      showCancelButton: true,
      cancelButtonText: 'Continue Shopping'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/cart');
      }
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    const productId = product._id || product.id;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      Swal.fire({
        icon: 'info',
        title: 'Removed from Wishlist',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      addToWishlist(product);
      Swal.fire({
        icon: 'success',
        title: 'Added to Wishlist!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    // First, add product to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 1);
    }

    // Show checkout modal with user information form
    const { value: formValues } = await Swal.fire({
      title: '<strong>Checkout - Enter Your Information</strong>',
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="margin-bottom: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Product:</span>
              <strong>${product.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Quantity:</span>
              <strong>${quantity}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #6b7280;">Price:</span>
              <strong>$${product.price}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #d1d5db; margin-top: 10px;">
              <span style="color: #1f2937; font-weight: 600;">Total Amount:</span>
              <strong style="color: #1f2937; font-size: 18px;">$${(product.price * quantity).toFixed(2)}</strong>
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
      confirmButtonText: '<i class="fa fa-check"></i> Place Order',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'checkout-modal',
        confirmButton: 'checkout-confirm-btn',
        cancelButton: 'checkout-cancel-btn'
      },
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const phone = document.getElementById('swal-phone').value.trim();
        const address = document.getElementById('swal-address').value.trim();
        const notes = document.getElementById('swal-notes').value.trim();

        // Validation
        if (!name || !email || !phone || !address) {
          Swal.showValidationMessage('Please fill in all required fields (*)');
          return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }

        // Phone validation (basic)
        if (phone.length < 10) {
          Swal.showValidationMessage('Please enter a valid phone number');
          return false;
        }

        return { name, email, phone, address, notes };
      }
    });

    if (formValues) {
      try {
        // Show processing message
        Swal.fire({
          title: 'Processing Order...',
          html: 'Please wait while we process your order',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });

        // Prepare order data
        const orderData = {
          customerInfo: formValues,
          items: [{
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
          }],
          totalAmount: product.price * quantity,
          status: 'pending',
          orderDate: new Date().toISOString()
        };

        // Send order to backend
        const response = await axiosInstance.post('/orders', orderData);

        // Show success message
        await Swal.fire({
          title: '<strong>Order Placed Successfully! 🎉</strong>',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p style="color: #059669; font-weight: 500; margin-bottom: 15px;">
                Thank you for your order!
              </p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <div style="margin-bottom: 8px;">
                  <strong>Order ID:</strong> ${response.data.order?._id || 'Processing'}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Customer:</strong> ${formValues.name}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Total Amount:</strong> $${(product.price * quantity).toFixed(2)}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                📧 A confirmation email has been sent to <strong>${formValues.email}</strong>
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                📱 We will contact you at <strong>${formValues.phone}</strong> to confirm delivery details.
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#000',
          confirmButtonText: 'Continue Shopping',
          showCancelButton: true,
          cancelButtonText: 'View Cart',
          cancelButtonColor: '#059669'
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            router.push('/cart');
          } else {
            router.push('/');
          }
        });

      } catch (error) {
        console.error('Error placing order:', error);
        Swal.fire({
          title: 'Order Failed',
          html: `
            <p style="color: #dc2626; margin-bottom: 10px;">
              ${error.response?.data?.message || 'Failed to place order. Please try again.'}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If the problem persists, please contact our support team.
            </p>
          `,
          icon: 'error',
          confirmButtonColor: '#000',
          confirmButtonText: 'Try Again'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-black">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => router.push('/')} className="hover:text-black transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/')} className="hover:text-black transition-colors">Products</button>
            <span>/</span>
            <span className="text-black font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative w-full h-[480px] bg-gray-50 border border-gray-200 overflow-hidden cursor-crosshair"
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
                  transition: isZoomed ? 'none' : 'transform 0.3s ease'
                }}
                priority
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="text-black font-bold text-lg border border-black px-4 py-2">OUT OF STOCK</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative h-20 bg-gray-50 border overflow-hidden cursor-pointer transition-all ${
                    selectedImage === product.image ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 bg-gray-50 border overflow-hidden cursor-pointer transition-all ${
                      selectedImage === img ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-3xl font-bold text-black leading-tight">{product.name}</h1>

            {/* Rating row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
                <span className="text-sm text-gray-500 ml-2">4.5 (128 reviews)</span>
              </div>
              {product.sku && (
                <span className="text-sm text-gray-400">SKU: <span className="text-black font-medium">{product.sku}</span></span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-black">৳{product.price?.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">৳{product.originalPrice.toFixed(2)}</span>
                  <span className="text-red-500 font-semibold text-base">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-black font-medium">In Stock</span>
                  <span className="text-gray-400">({product.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Feature highlight */}
            {product.feature && (
              <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black">
                <span className="font-semibold">Highlight: </span>{product.feature}
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-black">{product.category}</span>
              </div>
              {product.subcategory && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Subcategory</span>
                  <span className="font-medium text-black">{product.subcategory}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium text-black">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Color</span>
                  <span className="font-medium text-black">{product.color}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-black">Quantity</span>
              <div className="flex items-center border border-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors text-lg font-medium"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-black font-semibold border-x border-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors text-lg font-medium"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white font-semibold text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                    isInWishlist(product._id || product.id)
                      ? 'border-black bg-black text-white'
                      : 'border-black text-black hover:bg-black hover:text-white'
                  }`}
                  title={isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <FaHeart className="text-base" />
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 border border-black text-black font-semibold text-sm hover:bg-black hover:text-white transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <SocialShare product={product} />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 text-xs text-gray-500 pt-2">
              <span>✓ Free Shipping</span>
              <span>✓ 30-Day Returns</span>
              <span>✓ Quality Guarantee</span>
            </div>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="mt-14 border-t border-gray-200 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Description */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-black mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="border border-gray-300 text-gray-600 px-3 py-1 text-xs hover:border-black hover:text-black transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 py-14">
          <div className="container mx-auto px-4 ">
            <h2 className="text-2xl font-bold text-black mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
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

      {/* Floating Share Button */}
      {product && <FloatingShareButton product={product} />}
    </div>
  );
};

export default ProductDetailsPage;
