import Seo from '../components/Seo';
import LegalPage from '../components/LegalPage';
import { site } from '../config/site';

const H2 = ({ children }) => (
  <h2 className="pt-4 font-serif text-xl text-chocolate-800">{children}</h2>
);

export default function RefundPolicy() {
  return (
    <>
      <Seo title="Refund Policy" noindex />
      <LegalPage eyebrow="Legal" title="Refund Policy" updated="Placeholder">
        <p className="font-semibold text-chocolate-800">
          This is a sample refund policy template. Adjust it to Priscilla&rsquo;s
          actual refund rules and confirm before going live.
        </p>

        <H2>Digital products</H2>
        <p>
          This shop sells digital products (PDF downloads). Because digital files
          are delivered instantly and cannot be returned, purchases are
          generally final once the files have been downloaded.
        </p>

        <H2>When a refund may apply</H2>
        <ul className="list-disc space-y-1 pl-5">
          <li>The download link does not work and the issue cannot be resolved.</li>
          <li>The product you received does not match the product purchased.</li>
          <li>A payment was completed in error for the wrong product or amount.</li>
        </ul>

        <H2>How to request a refund</H2>
        <p>
          Contact {site.name} using the details on the Contact page within 7 days
          of your purchase, including your Paystack transaction reference. Each
          request is handled individually.
        </p>

        <H2>Processing</H2>
        <p>
          Approved refunds are returned to the original payment method through
          Paystack. Depending on your bank, it may take a few days for the refund
          to appear.
        </p>

        <H2>Chargebacks</H2>
        <p>
          Please contact {site.name} before starting a chargeback — most issues
          can be resolved directly and quickly.
        </p>
      </LegalPage>
    </>
  );
}