export type Order = {
  id: string;
  order_status: string;
  payment_status: string;
  payment_type: string;
  payment_moment: string;
  delivery_date: string;
  item_quantity: number;
  subtotal: string;
  discount: string;
  payment_made: string;
  cost: string;
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
  unit_cost: string;
  unit_discount: string;
  unit_quantity: string;
  unit_subtotal: string;
}

