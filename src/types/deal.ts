export type Deal = {
  price: number;
  start_date: string;
  end_date: string;
  retailer: {
    name: string;
  };
  product: {
    name: string;
    size: string;
  };
};
