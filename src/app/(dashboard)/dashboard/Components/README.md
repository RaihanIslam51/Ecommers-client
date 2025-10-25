# Dashboard Components Documentation

This directory contains reusable, smallest dashboard components that can be used across your application.

## Components Overview

### 1. **Button** (`Button.jsx`)
Versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `icon`: Icon component
- `iconPosition`: 'left' | 'right'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean

**Example:**
```jsx
import { Button } from './Components';
import { Plus } from 'lucide-react';

<Button variant="primary" size="md" icon={<Plus />}>
  Add Product
</Button>
```

---

### 2. **Badge** (`Badge.jsx`)
Display status, categories, or labels.

**Props:**
- `variant`: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'pink'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: Icon component
- `dot`: boolean (show status dot)

**Example:**
```jsx
import { Badge } from './Components';

<Badge variant="success" dot>Active</Badge>
<Badge variant="warning">Pending</Badge>
```

---

### 3. **Card** (`Card.jsx`)
Container component for content sections.

**Props:**
- `title`: string
- `subtitle`: string
- `headerAction`: ReactNode
- `hoverable`: boolean
- `bordered`: boolean

**Example:**
```jsx
import { Card, Button } from './Components';

<Card 
  title="Recent Orders" 
  subtitle="Latest transactions"
  headerAction={<Button size="sm">View All</Button>}
>
  {/* Card content */}
</Card>
```

---

### 4. **Avatar** (`Avatar.jsx`)
Display user avatars with status indicators.

**Props:**
- `src`: string (image URL)
- `initials`: string (fallback text)
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `shape`: 'circle' | 'square'
- `status`: 'online' | 'offline' | 'away' | 'busy'

**Example:**
```jsx
import { Avatar } from './Components';

<Avatar initials="JD" size="md" status="online" />
<Avatar src="/user.jpg" size="lg" />
```

---

### 5. **Alert** (`Alert.jsx`)
Display notifications and messages.

**Props:**
- `type`: 'success' | 'warning' | 'danger' | 'info'
- `title`: string
- `message`: string
- `icon`: ReactNode
- `dismissible`: boolean
- `onDismiss`: function

**Example:**
```jsx
import { Alert } from './Components';
import { CheckCircle } from 'lucide-react';

<Alert 
  type="success" 
  title="Success!"
  message="Your changes have been saved."
  icon={<CheckCircle className="w-5 h-5" />}
  dismissible
/>
```

---

### 6. **ProgressBar** (`ProgressBar.jsx`)
Visual progress indicator.

**Props:**
- `value`: number (0-100)
- `color`: 'blue' | 'green' | 'purple' | 'orange' | 'red'
- `size`: 'sm' | 'md' | 'lg'
- `showLabel`: boolean
- `label`: string
- `animated`: boolean

**Example:**
```jsx
import { ProgressBar } from './Components';

<ProgressBar 
  value={75} 
  color="green" 
  showLabel 
  label="Sales Target"
/>
```

---

### 7. **Stat** (`Stat.jsx`)
Display statistics with trends.

**Props:**
- `title`: string
- `value`: string
- `change`: string (percentage)
- `trend`: 'up' | 'down'
- `icon`: ReactNode
- `color`: gradient color
- `bgColor`: background gradient
- `description`: string

**Example:**
```jsx
import { Stat } from './Components';
import { DollarSign } from 'lucide-react';

<Stat 
  title="Total Revenue"
  value="$45,231.89"
  change="+20.1%"
  trend="up"
  icon={DollarSign}
  description="vs last period"
/>
```

---

### 8. **Table** (`Table.jsx`)
Data table with customizable columns.

**Props:**
- `columns`: Array of column definitions
- `data`: Array of data objects
- `hoverable`: boolean
- `striped`: boolean

**Example:**
```jsx
import { Table, Badge } from './Components';

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { 
    key: 'status', 
    label: 'Status',
    render: (row) => <Badge variant="success">{row.status}</Badge>
  }
];

const data = [
  { id: '#12345', customer: 'John Doe', status: 'Completed' }
];

<Table columns={columns} data={data} hoverable />
```

---

### 9. **IconBox** (`IconBox.jsx`)
Display icons with background.

**Props:**
- `icon`: ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: gradient color
- `bgColor`: background gradient
- `shape`: 'square' | 'circle'

**Example:**
```jsx
import { IconBox } from './Components';
import { ShoppingCart } from 'lucide-react';

<IconBox 
  icon={<ShoppingCart />}
  size="lg"
  color="from-blue-500 to-cyan-500"
  bgColor="from-blue-50 to-cyan-50"
/>
```

---

### 10. **Tooltip** (`Tooltip.jsx`)
Show contextual information on hover.

**Props:**
- `content`: string
- `position`: 'top' | 'bottom' | 'left' | 'right'

**Example:**
```jsx
import { Tooltip, Button } from './Components';

<Tooltip content="Click to add new item" position="top">
  <Button>Add</Button>
</Tooltip>
```

---

### 11. **Input** (`Input.jsx`)
Form input field.

**Props:**
- `type`: string
- `label`: string
- `placeholder`: string
- `error`: string
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `disabled`: boolean

**Example:**
```jsx
import { Input } from './Components';
import { Search } from 'lucide-react';

<Input 
  label="Search"
  placeholder="Search products..."
  icon={<Search className="w-4 h-4" />}
  iconPosition="left"
  fullWidth
/>
```

---

### 12. **Spinner** (`Spinner.jsx`)
Loading indicator.

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'blue' | 'white' | 'gray' | 'green' | 'red' | 'purple'

**Example:**
```jsx
import { Spinner } from './Components';

<Spinner size="md" color="blue" />
```

---

### 13. **Dropdown** (`Dropdown.jsx`)
Select dropdown menu.

**Props:**
- `label`: string
- `options`: Array of {value, label, icon}
- `onChange`: function
- `value`: string
- `placeholder`: string

**Example:**
```jsx
import { Dropdown } from './Components';

const options = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
];

<Dropdown 
  label="Timeframe"
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

---

### 14. **EmptyState** (`EmptyState.jsx`)
Display when no data is available.

**Props:**
- `icon`: ReactNode
- `title`: string
- `description`: string
- `action`: ReactNode

**Example:**
```jsx
import { EmptyState, Button } from './Components';
import { Package } from 'lucide-react';

<EmptyState 
  icon={<Package className="w-16 h-16" />}
  title="No products found"
  description="Start by adding your first product"
  action={<Button>Add Product</Button>}
/>
```

---

## Usage Tips

### Import Multiple Components
```jsx
import { Button, Card, Badge, Alert } from '@/app/(dashboard)/dashboard/Components';
```

### Combine Components
```jsx
<Card title="User Profile">
  <div className="flex items-center gap-4">
    <Avatar initials="JD" size="xl" status="online" />
    <div>
      <h3>John Doe</h3>
      <Badge variant="success">Active</Badge>
    </div>
  </div>
  <Button variant="primary" fullWidth>Edit Profile</Button>
</Card>
```

### Responsive Design
All components are designed with responsive classes and work seamlessly across devices.

---

## Best Practices

1. **Consistency**: Use the same component variants across your dashboard
2. **Accessibility**: Components include proper ARIA attributes
3. **Performance**: Components are optimized for React rendering
4. **Customization**: Use className prop to add custom styles
5. **Type Safety**: Add TypeScript definitions for better development experience

---

## Color Palette

The components use a consistent color system:
- **Blue**: Primary actions, information
- **Green**: Success, positive trends
- **Yellow**: Warnings, pending states
- **Red**: Errors, negative trends
- **Purple**: Secondary actions, special features
- **Gray**: Neutral, disabled states

---

## Future Enhancements

- Add TypeScript definitions
- Add animation variants
- Add dark mode support
- Add accessibility improvements
- Add unit tests
