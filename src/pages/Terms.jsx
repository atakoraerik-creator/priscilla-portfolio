import Seo from '../components/Seo';
import LegalPage from '../components/LegalPage';
import { site } from '../config/site';

const H2 = ({ children }) => (
  <h2 className="pt-4 font-serif text-xl text-chocolate-800">{children}</h2>
);

export default function Terms() {
  return (
    <>
      <Seo title="Terms & Conditions" noindex />
      <LegalPage eyebrow="Legal" title="Terms & Conditions" updated="Placeholder">
        <p className="font-semibold text-chocolate-800">
          This is a sample Terms &amp; Conditions template. Review it, adjust it
          to your business and confirm with a professional before publishing.
        </p>

        <H2>1. Acceptance of terms</H2>
        <p>
          By accessing {site.name}&rsquo;s website and shop, you agree to these
          Terms &amp; Conditions. If you do not agree, please do not use the site.
        </p>

        <H2>2. Digital products</H2>
        <p>
          All products sold on this website are digital files (PDF). No physical
          products are shipped. After a successful, verified payment you receive a
          temporary link to download your purchase.
        </p>

        <H2>3. Use of purchased material</H2>
        <p>
          Purchased books are for personal use by the buyer. Reselling,
          redistributing, or sharing purchased material without permission is not
          allowed.
        </p>

        <H2>4. Payments</H2>
        <p>
          Payments are processed securely by Paystack. You confirm that your
          payment details are valid and that you are authorised to use them.
        </p>

        <H2>5. Intellectual property</H2>
        <p>
          All content on this website — text, design, photography and products —
          belongs to {site.name} unless otherwise stated and is protected by
          copyright.
        </p>

        <H2>6. Limitation of liability</H2>
        <p>
          The website and its content are provided &ldquo;as is&rdquo;. To the
          fullest extent permitted by law, {site.name} is not liable for any
          indirect or consequential loss arising from use of the site or its
          products.
        </p>

        <H2>7. Changes and governing law</H2>
        <p>
          These terms may be updated at any time. Continued use of the site after
          changes means you accept the updated terms.
        </p>
      </LegalPage>
    </>
  );
}