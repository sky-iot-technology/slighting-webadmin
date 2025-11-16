import { fakeProducts, Product } from '@/core/shared/constants/mock-api';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  type InitialDevice = {
    id?: string;
    name?: string;
    type?: string;
    parent_group_id?: string;
    tags?: string[];
    device_info?: {
      lat?: number;
      lon?: number;
      online?: boolean;
    };
    device_asset?: {
      asset_attribute?: any[];
    };
  };

  let initialData: InitialDevice | null = null;
  let pageTitle = 'Thêm Thiết Bị';

  if (productId !== 'new') {
    const data = await fakeProducts.getProductById(Number(productId));
    const product = data.product as Product | undefined;
    if (!product) {
      notFound();
    }
    // Map Product -> InitialDevice shape expected by ProductForm
    initialData = {
      id: String(product.id),
      name: product.name,
      type: '',
      parent_group_id: '',
      tags: [],
      device_info: {
        lat: 0,
        lon: 0,
        online: false
      },
      device_asset: {
        asset_attribute: []
      }
    };
    pageTitle = `Thông Tin Thiết Bị`;
  }

  return <ProductForm initialData={initialData} pageTitle={pageTitle} />;
}
