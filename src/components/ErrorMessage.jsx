import { motion } from 'framer-motion';

/**
 * Friendly, consistent error message. Never shows raw server
 * errors or secret information.
 */
export default function ErrorMessage({ message = 'Something went wrong. Please try again.', title = 'Sorry' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm leading-relaxed text-red-700">{message}</p>
    </motion.div>
  );
}