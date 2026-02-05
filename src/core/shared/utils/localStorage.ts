export const STORAGE_KEYS = {
  PRODUCT_LISTING_PARAMS: 'product_listing_params'
} as const;

export const localUtils = {
  // Clear storage
  clearLocalStorage: () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCT_LISTING_PARAMS);
  }
};
