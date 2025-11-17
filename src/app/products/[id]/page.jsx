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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            
           
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Product Details</h2>
          <p className="text-slate-600">Please wait while we fetch the best information for you...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors duration-200 font-medium">
              Home
            </button>
            <span className="text-slate-400">/</span>
            <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors duration-200 font-medium">
              Products
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">{product.category}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Images */}
          <div className="space-y-6">
            {/* Main Image with Enhanced Zoom */}
            <div 
              className="relative w-full h-[500px] lg:h-[600px] bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-2xl cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
                style={{
                  transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {isZoomed && (
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Zoom Active
                </div>
              )}
            </div>
            
            {/* Enhanced Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedImage === product.image ? 'border-blue-500 shadow-blue-200 shadow-lg' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                  {selectedImage === product.image && (
                    <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-xl" />
                  )}
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      selectedImage === img ? 'border-blue-500 shadow-blue-200 shadow-lg' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    {selectedImage === img && (
                      <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-xl" />
                    )}
                  </div>
                ))}
              </div>
            )}






            {/* Product Information Cards */}
            <div className="space-y-6">
              {/* Cooking Instructions */}
              {product.cookingInstructions && (
                <div className="bg-linear-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3">
                    <span className="w-12 h-12 bg-linear-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">👨‍🍳</span>
                    </span>
                    Cooking Instructions
                  </h3>
                  <div className="text-slate-700 whitespace-pre-line text-base leading-relaxed bg-white/50 rounded-xl p-4 border border-orange-100">
                    {product.cookingInstructions}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredientsList && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                    <span className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🥕</span>
                    </span>
                    Premium Ingredients
                  </h3>
                  <div className="text-slate-700 whitespace-pre-line text-base leading-relaxed bg-white/50 rounded-xl p-4 border border-green-100">
                    {product.ingredientsList}
                  </div>
                </div>
              )}

              {/* Allergen Information */}
              {product.allergenInfo && (
                <div className="bg-linear-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                    <span className="w-12 h-12 bg-linear-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">⚠️</span>
                    </span>
                    Allergen Information
                  </h3>
                  <p className="text-red-700 text-base leading-relaxed bg-white/50 rounded-xl p-4 border border-red-100">{product.allergenInfo}</p>
                </div>
              )}

              {/* Storage Instructions */}
              {product.storageInstructions && (
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <span className="w-12 h-12 bg-linear-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🧊</span>
                    </span>
                    Storage Instructions
                  </h3>
                  <p className="text-blue-700 text-base leading-relaxed bg-white/50 rounded-xl p-4 border border-blue-100">{product.storageInstructions}</p>
                </div>
              )}
            </div>




          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                    {product.name}
                  </h1>
                  
                  {/* Product Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {product.productType && (
                      <span className="bg-linear-to-r from-green-100 to-green-200 text-green-800 text-sm px-4 py-2 rounded-full font-semibold border border-green-300 shadow-sm">
                        🌱 {product.productType}
                      </span>
                    )}
                    {product.freshnessLevel && (
                      <span className="bg-linear-to-r from-blue-100 to-blue-200 text-blue-800 text-sm px-4 py-2 rounded-full font-semibold border border-blue-300 shadow-sm">
                        ✨ {product.freshnessLevel}
                      </span>
                    )}
                    {product.packagingType && (
                      <span className="bg-linear-to-r from-purple-100 to-purple-200 text-purple-800 text-sm px-4 py-2 rounded-full font-semibold border border-purple-300 shadow-sm">
                        📦 {product.packagingType}
                      </span>
                    )}
                    {product.allergenInfo && (
                      <span className="bg-linear-to-r from-orange-100 to-orange-200 text-orange-800 text-sm px-4 py-2 rounded-full font-semibold border border-orange-300 shadow-sm">
                        ⚠️ Contains allergens
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating and SKU */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                    <span className="text-sm text-slate-600 ml-2 font-medium">(4.5)</span>
                    <span className="text-sm text-slate-500 ml-1">• 128 reviews</span>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  SKU: <span className="font-semibold text-slate-900">{product.sku}</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200 shadow-xl">
              <div className="flex items-center gap-6 mb-6">
                <span className="text-6xl font-bold text-slate-900">
                  ${product.price?.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-4xl text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-slate-700 font-semibold">Availability:</span>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-semibold">{product.stock} in stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-semibold">Out of stock</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>

            {/* Feature Text */}
            {product.feature && (
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">Special Feature</h3>
                    <p className="text-blue-800 font-medium text-lg">{product.feature}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Product Details */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {product.netWeight && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-3">⚖️</div>
                  <div className="text-sm text-slate-600 font-medium mb-1">Net Weight</div>
                  <div className="font-bold text-slate-900 text-xl">{product.netWeight}</div>
                </div>
              )}
              {product.servings && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-3">🍽️</div>
                  <div className="text-sm text-slate-600 font-medium mb-1">Servings</div>
                  <div className="font-bold text-slate-900 text-xl">{product.servings}</div>
                </div>
              )}
              {product.shelfLife && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-3">🕒</div>
                  <div className="text-sm text-slate-600 font-medium mb-1">Shelf Life</div>
                  <div className="font-bold text-slate-900 text-xl">{product.shelfLife}</div>
                </div>
              )}
              {product.preparationTime && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-3">⏱️</div>
                  <div className="text-sm text-slate-600 font-medium mb-1">Prep Time</div>
                  <div className="font-bold text-slate-900 text-xl">{product.preparationTime}</div>
                </div>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div className="bg-slate-50 rounded-xl p-4">
                <span className="text-sm text-slate-600 font-medium block mb-1">Category:</span>
                <p className="font-bold text-slate-900 text-lg">{product.category}</p>
              </div>
              {product.subcategory && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <span className="text-sm text-slate-600 font-medium block mb-1">Subcategory:</span>
                  <p className="font-bold text-slate-900 text-lg">{product.subcategory}</p>
                </div>
              )}
              {product.brand && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <span className="text-sm text-slate-600 font-medium block mb-1">Brand:</span>
                  <p className="font-bold text-slate-900 text-lg">{product.brand}</p>
                </div>
              )}
              {product.weight && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <span className="text-sm text-slate-600 font-medium block mb-1">Weight:</span>
                  <p className="font-bold text-slate-900 text-lg">{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <span className="text-sm text-slate-600 font-medium block mb-1">Dimensions:</span>
                  <p className="font-bold text-slate-900 text-lg">{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 pt-6 bg-slate-50 rounded-2xl p-6">
              <span className="text-slate-700 font-bold text-lg">Quantity:</span>
              <div className="flex items-center border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 text-black py-4 hover:bg-slate-100 transition-all duration-200 font-bold text-xl"
                >
                  -
                </button>
                <span className="px-8 py-4 border-x-2 border-slate-300 font-bold text-xl text-slate-900 bg-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-6 py-4 text-black hover:bg-slate-100 transition-all duration-200 font-bold text-xl"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-2xl hover:shadow-slate-900/50 hover:scale-105 text-lg"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="text-xl" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`px-8 py-5 border-2 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 ${
                    isInWishlist(product._id || product.id)
                      ? 'border-red-500 bg-red-50 hover:bg-red-100 shadow-red-200'
                      : 'border-slate-300 hover:border-red-500 hover:bg-red-50 shadow-slate-200'
                  }`}
                  title={isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <FaHeart className={`text-2xl ${
                    isInWishlist(product._id || product.id) ? 'text-red-500' : 'text-slate-600'
                  }`} />
                </button>
              </div>

              {/* Buy Now and Share Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-8 py-5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-900/50 hover:scale-105 text-lg"
                  disabled={product.stock === 0}
                >
                  🛒 Buy Now - Fast Checkout
                </button>
                <SocialShare product={product} />
              </div>
            </div>



            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-slate-600 text-xl">📝</span>
                </span>
                Product Description
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg">{product.description}</p>
            </div>

           

            {/* Origin Information */}
            {(product.farmSource || product.originLocation) && (
              <div className="bg-linear-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
                  <span className="w-12 h-12 bg-linear-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🌱</span>
                  </span>
                  Origin Information
                </h3>
                <div className="space-y-4">
                  {product.farmSource && (
                    <div className="flex items-start gap-4 bg-white/50 rounded-xl p-4">
                      <span className="text-yellow-600 text-2xl mt-1">🏭</span>
                      <div>
                        <span className="font-bold text-yellow-800 text-lg">Farm/Source:</span>
                        <p className="text-yellow-700 mt-2 text-base leading-relaxed">{product.farmSource}</p>
                      </div>
                    </div>
                  )}
                  {product.originLocation && (
                    <div className="flex items-start gap-4 bg-white/50 rounded-xl p-4">
                      <span className="text-yellow-600 text-2xl mt-1">📍</span>
                      <div>
                        <span className="font-bold text-yellow-800 text-lg">Location:</span>
                        <p className="text-yellow-700 mt-2 text-base leading-relaxed">{product.originLocation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}




            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Product Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-linear-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-bold border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      #{tag}
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
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-16 bg-slate-50">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Related Products</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover more products you might love from our premium collection</p>
            <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
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
