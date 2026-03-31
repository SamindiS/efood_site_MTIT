const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-[#255F38] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Failure Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FB4141] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#FB4141] mb-3">Payment Failed</h1>
        <p className="text-gray-600 mb-6">Something went wrong with your payment. Please try again.</p>

        {/* Warning pattern */}
        <div className="flex justify-center space-x-1 mb-6">
          {['#FB4141', '#1F7D53', '#FB4141', '#1F7D53', '#FB4141'].map((color, i) => (
            <div key={i} className="w-2 h-8 rounded-full" style={{ backgroundColor: color }}></div>
          ))}
        </div>

        <div className="space-y-4">
          <button className="w-full bg-[#27391C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#1F7D53] transition">
            Try Payment Again
          </button>
          <button className="w-full border border-[#27391C] text-[#1F7D53] font-bold py-3 px-4 rounded-lg hover:bg-[#F0F7ED] transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;