import React from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Eye, Package } from 'lucide-react';

/**
 * Category List View Component - Table view for categories
 */
const CategoryListView = ({ categories, onEdit, onDelete, onView, selectedItems = [], onSelectItem }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      categories.forEach(cat => {
        if (!selectedItems.includes(cat._id || cat.id)) {
          onSelectItem(cat._id || cat.id);
        }
      });
    } else {
      categories.forEach(cat => {
        if (selectedItems.includes(cat._id || cat.id)) {
          onSelectItem(cat._id || cat.id);
        }
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              {onSelectItem && (
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={categories.length > 0 && categories.every(cat => selectedItems.includes(cat._id || cat.id))}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Description
              </th>
              <th className="px-6 py-4 text-center text-xs font-light text-gray-600 uppercase tracking-widest">
                Products
              </th>
              <th className="px-6 py-4 text-center text-xs font-light text-gray-600 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-light text-gray-600 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => {
              const categoryId = category._id || category.id;
              const isSelected = selectedItems.includes(categoryId);
              
              return (
                <tr 
                  key={categoryId} 
                  className={`hover:bg-blue-50 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  {onSelectItem && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectItem(categoryId)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}
                  
                  {/* Category Info */}
                  <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center shrink-0 relative"
                      style={{ backgroundColor: category.color || '#f3f4f6' }}
                    >
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-light text-black">{category.name}</p>
                      <p className="text-xs text-gray-500 font-light">ID: {category.id}</p>
                    </div>
                  </div>
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 font-light line-clamp-2 max-w-xs">
                    {category.description || 'No description'}
                  </p>
                </td>

                {/* Product Count */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 text-black text-sm font-light">
                    <Package className="w-4 h-4" />
                    {category.productCount || 0}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 border text-xs font-light uppercase tracking-widest ${
                    category.status === 'active'
                      ? 'bg-white text-black border-black'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(category)}
                      className="p-2 text-black border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-black border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="p-2 text-black border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-light text-black mb-2">No categories found</h3>
          <p className="text-gray-500 font-light">Try adjusting your filters or add a new category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryListView;
