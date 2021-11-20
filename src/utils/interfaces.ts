export type Order = {
  id: string;
  order_status: string;
  payment_status: string;
  payment_type: string;
  payment_moment: string;
  delivery_date: string;
  item_quantity: number;
  subtotal: number;
  discount: number
  payment_made: number;
  cost: number;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: string;
}

export type Item = {
  description: string;
  item_id: string;
  observation: string;
  order_id: number;
  unit_cost: number;
  unit_discount: number;
  unit_quantity: number;
  unit_subtotal: number;
}

