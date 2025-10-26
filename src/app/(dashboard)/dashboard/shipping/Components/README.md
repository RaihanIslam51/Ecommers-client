# Shipping Components Documentation

এই ফোল্ডারে shipping management এর জন্য সকল reusable components রয়েছে।

## 📦 Components List

### 1. **ShippingStats.jsx**
- **Purpose**: Shipping statistics cards display করে (Pending, In Transit, Delivered, Failed)
- **Props**: 
  - `stats` (array) - Custom stats data (optional)
- **Features**:
  - Responsive grid layout
  - Color-coded status cards
  - Hover effects with scale animation
  - Icon support

### 2. **ShippingFilters.jsx**
- **Purpose**: Search এবং filter করার জন্য
- **Props**:
  - `searchTerm`, `setSearchTerm` - Search functionality
  - `statusFilter`, `setStatusFilter` - Status filtering
  - `dateFilter`, `setDateFilter` - Date range filtering
- **Features**:
  - Search by Order ID/Tracking number
  - Status dropdown with counts
  - Date range selection

### 3. **ShippingStatusBadge.jsx**
- **Purpose**: Shipping status এর জন্য color-coded badges
- **Props**:
  - `status` (string) - pending, processing, transit, delivered, failed, returned
- **Features**:
  - Icon + text display
  - Color-coded based on status
  - Rounded pill design

### 4. **ShippingTable.jsx**
- **Purpose**: Main table যেখানে সব shipments display হয়
- **Props**:
  - `orders` (array) - Orders data
  - `onViewDetails` (function) - View details callback
  - `onUpdateStatus` (function) - Update status callback
- **Features**:
  - Responsive table design
  - Sample data included
  - Uses ShippingTableRow component

### 5. **ShippingTableRow.jsx**
- **Purpose**: Individual table row component
- **Props**:
  - `order` (object) - Single order data
  - `onViewDetails`, `onUpdateStatus` - Action callbacks
- **Features**:
  - Customer avatar
  - Action buttons (View, Edit, Track)
  - Status badge integration
  - Hover effects

### 6. **ShippingDetailsModal.jsx**
- **Purpose**: Detailed shipping information modal
- **Props**:
  - `order` (object) - Order details
  - `isOpen` (boolean) - Modal visibility
  - `onClose` (function) - Close callback
- **Features**:
  - Full order details
  - Tracking timeline
  - Customer & package info
  - Print label & update status actions

### 7. **QuickActions.jsx**
- **Purpose**: Quick action buttons for common tasks
- **Features**:
  - Create Shipment
  - Bulk Import
  - Print Labels
  - Export Report
- **Design**: Gradient colored action cards with icons

### 8. **ShippingCarriers.jsx**
- **Purpose**: Display carrier performance metrics
- **Features**:
  - Carrier statistics (total shipments, on-time %, avg delivery time)
  - Rating display
  - Progress bars
  - Hover animations

## 🎨 Design Features

### Color Scheme
- **Pending**: Yellow/Amber
- **Processing/In Transit**: Blue/Indigo
- **Delivered**: Green/Emerald
- **Failed**: Red/Rose
- **Default**: Purple/Pink

### Animations
- Hover scale effects (`hover:scale-105`)
- Shadow transitions (`hover:shadow-xl`)
- Smooth color transitions
- Gradient backgrounds

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Tailwind breakpoints: `sm:`, `md:`, `lg:`

## 💡 Usage Example

```jsx
import {
  ShippingStats,
  ShippingFilters,
  ShippingTable,
  ShippingDetailsModal,
  QuickActions,
  ShippingCarriers,
} from './Components';

function ShippingPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <ShippingStats />
      <QuickActions />
      <ShippingCarriers />
      <ShippingFilters {...filterProps} />
      <ShippingTable 
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setIsModalOpen(true);
        }}
      />
      <ShippingDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

## 🔧 Customization

### Adding Custom Stats
```jsx
const customStats = [
  { label: 'Custom Stat', value: 100, color: 'blue', icon: '📊' }
];

<ShippingStats stats={customStats} />
```

### Custom Carriers
Edit `ShippingCarriers.jsx` এর `carriers` array তে নতুন carrier add করুন।

## 📱 Mobile Responsiveness

সকল components mobile-friendly:
- Tables scroll horizontally on mobile
- Grid layouts stack on small screens
- Touch-friendly button sizes
- Responsive text sizes

## 🎯 Best Practices

1. Always provide proper callback functions
2. Handle loading states in parent component
3. Add error boundaries for production
4. Implement proper data fetching
5. Add form validation for modals

## 🚀 Future Enhancements

- [ ] Add pagination component
- [ ] Implement sorting functionality
- [ ] Add export to PDF/Excel
- [ ] Real-time tracking updates
- [ ] Notification system
- [ ] Bulk operations support
