import { authenticatedApi } from '@/core/shared/api';
import { fakeProducts } from '@/core/shared/constants/mock-api';

import type {
  GetProductsParamsDto,
  Product,
  ProductDetail,
  ProductListResponseDto,
  UpdateProductDto,
  CreateProductDto
} from './types';

// Define a type for the expected response when fetching a list of products
// This often includes pagination information if your API supports it.

class ProductsApi {
  public async getAll(
    params?: GetProductsParamsDto
  ): Promise<ProductListResponseDto> {
    try {
      // For now, use mock data. Later this can be replaced with real API calls
      const mockData = await this.getMockProducts(params);

      // Transform mock data to match expected response format
      const products = mockData.products;
      const totalProducts = mockData.total_products;
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        total_products: totalProducts,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      };
    } catch (error) {
      // Fallback to mock data if API fails
      return this.getMockProducts(params);
    }
  }

  public async getById(id: string | number): Promise<Product> {
    try {
      // Try real API first
      return await authenticatedApi.get<Product>(`/products/${id}`);
    } catch (error) {
      // Fallback to mock data
      const mockData = await this.getMockProducts();
      const product = mockData.products.find((p) => p.id === Number(id));
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
    }
  }

  public async getDetailById(id: string | number): Promise<ProductDetail> {
    try {
      // Try real API first
      return await authenticatedApi.get<ProductDetail>(
        `/products/${id}/detail`
      );
    } catch (error) {
      // Fallback to mock data
      const product = await this.getById(id);
      return {
        ...product,
        specifications: {},
        images: [product.photo_url],
        variants: [],
        reviews: [],
        related_products: []
      };
    }
  }

  public async getByCategory(
    categoryId: string | number,
    params?: GetProductsParamsDto
  ): Promise<ProductListResponseDto> {
    try {
      // Try real API first
      return await authenticatedApi.get<ProductListResponseDto>(
        `/categories/${categoryId}/products`,
        { params }
      );
    } catch (error) {
      // Fallback to mock data
      const mockData = await this.getMockProducts({
        ...params,
        category: categoryId.toString()
      });
      return mockData;
    }
  }

  public async create(data: CreateProductDto): Promise<Product> {
    try {
      // Try real API first
      return await authenticatedApi.post<Product>('/products', data);
    } catch (error) {
      // For mock data, just return the data with generated ID
      const newProduct: Product = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        stock_quantity: data.stock_quantity || 0,
        sku: data.sku || `SKU-${Date.now()}`,
        tags: data.tags || [],
        metadata: data.metadata || {},
        photo_url: data.photo_url || ''
      };
      return newProduct;
    }
  }

  public async update(
    id: string | number,
    data: UpdateProductDto
  ): Promise<Product> {
    try {
      // Try real API first
      return await authenticatedApi.put<Product>(`/products/${id}`, data);
    } catch (error) {
      // For mock data, return updated product
      const existingProduct = await this.getById(id);
      const updatedProduct: Product = {
        ...existingProduct,
        ...data,
        updated_at: new Date().toISOString()
      };
      return updatedProduct;
    }
  }

  public async delete(id: string | number): Promise<void> {
    try {
      // Try real API first
      await authenticatedApi.delete(`/products/${id}`);
    } catch (error) {
      // For mock data, just return (no actual deletion)
      console.log(`Mock: Product ${id} deleted`);
    }
  }

  // Private method to get mock data
  private async getMockProducts(
    params?: GetProductsParamsDto
  ): Promise<ProductListResponseDto> {
    // Initialize mock data
    fakeProducts.initialize();

    // Get filtered products
    const products = await fakeProducts.getAll({
      categories: params?.category ? [params.category] : undefined,
      search: params?.search
    });

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products: paginatedProducts as unknown as Product[],
      total_products: totalProducts,
      page,
      limit,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1
    };
  }
}

export const productsApi = new ProductsApi();
