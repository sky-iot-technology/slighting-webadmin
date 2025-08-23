import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // For now, we'll redirect to overview
  // In a real app, you would check authentication here
  // You can implement server-side session checking or JWT verification
  
  redirect('/dashboard/overview');
}
