'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import SocialShare from '@/app/components/SocialShare/SocialShare';
import FloatingShareButton from '@/app/components/SocialShare/FloatingShareButton';

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${params.id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => (item._id || item.id) === (product._id || product.id));

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        ...product,
        quantity: quantity
      });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show success message
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#000',
      timer: 2000
    });

    // Navigate to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 2000);
  };

  const handleBuyNow = async () => {
    // Show user information form
    const { value: formValues } = await Swal.fire({
      title: 'Enter Your Information',
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Full Name">' +
        '<input id="swal-email" class="swal2-input" placeholder="Email" type="email">' +
        '<input id="swal-phone" class="swal2-input" placeholder="Phone Number">' +
        '<textarea id="swal-address" class="swal2-textarea" placeholder="Delivery Address"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Place Order',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const email = document.getElementById('swal-email').value;
        const phone = document.getElementById('swal-phone').value;
        const address = document.getElementById('swal-address').value;

        if (!name || !email || !phone || !address) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }

        return { name, email, phone, address };
      }
    });

    if (formValues) {
      try {
        // Prepare order data
        const orderData = {
          customerInfo: formValues,
          product: {
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
          },
          totalAmount: product.price * quantity,
          orderDate: new Date().toISOString()
        };

        // Send to database
        await axiosInstance.post('/orders', orderData);

        // Show success message
        Swal.fire({
          title: 'Order Placed!',
          text: 'Your order has been placed successfully. We will contact you soon!',
          icon: 'success',
          confirmButtonColor: '#000'
        });

      } catch (error) {
        console.error('Error placing order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to place order. Please try again.',
          icon: 'error',
          confirmButtonColor: '#000'
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
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                <div
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === product.image ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
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
                <button className="px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Share Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  Buy Now
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

      {/* Floating Share Button */}
      {product && <FloatingShareButton product={product} />}
    </div>
  );
};

export default ProductDetailsPage;
