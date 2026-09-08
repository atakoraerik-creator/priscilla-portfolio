import ProductCard from './ProductCard';

export default function ProductGrid({ products, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}