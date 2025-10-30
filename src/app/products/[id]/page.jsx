'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import SocialShare from '@/app/components/SocialShare/SocialShare';
import FloatingShareButton from '@/app/components/SocialShare/FloatingShareButton';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/app/Home/TopSales/components/Productcard';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-black">
            Home
          </button>
          <span>/</span>
          <button onClick={() => router.push('/')} className="hover:text-black">
            Products
          </button>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              className="relative w-full h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-out"
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
                priority
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:border-gray-400 ${
                    selectedImage === product.image ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:border-gray-400 ${
                      selectedImage === img ? 'border-black' : 'border-transparent'
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
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                </div>
                <span className="text-sm text-gray-600">
                  SKU: <span className="font-semibold text-black">{product.sku}</span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-black">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">{product.stock} in stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of stock</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <span className="text-sm text-gray-600">Category:</span>
                <p className="font-semibold text-black">{product.category}</p>
              </div>
              {product.brand && (
                <div>
                  <span className="text-sm text-gray-600">Brand:</span>
                  <p className="font-semibold text-black">{product.brand}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-sm text-gray-600">Weight:</span>
                  <p className="font-semibold text-black">{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-sm text-gray-600">Dimensions:</span>
                  <p className="font-semibold text-black">{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-gray-700 font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`px-6 py-4 border-2 rounded-lg transition-all ${
                    isInWishlist(product._id || product.id)
                      ? 'border-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 hover:border-red-500 hover:bg-gray-50'
                  }`}
                  title={isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <FaHeart className={`text-xl ${
                    isInWishlist(product._id || product.id) ? 'text-red-500' : 'text-gray-600'
                  }`} />
                </button>
              </div>

              {/* Buy Now and Share Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  disabled={product.stock === 0}
                >
                  🛒 Buy Now
                </button>
                <SocialShare product={product} />
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 border-t">
                <span className="text-sm text-gray-600 mb-2 block">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Related Products</h2>
            <p className="text-sm text-gray-600">You might also like these products</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
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
      )}

      {/* Floating Share Button */}
      {product && <FloatingShareButton product={product} />}
    </div>
  );
};

export default ProductDetailsPage;
