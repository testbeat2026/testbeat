{/* ZOHO BOOKS TAB CONTENT */}
{activeTab === 'zoho' && (
  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-2xl space-y-4">
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Zoho Books Accounting & GST Invoicing API
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Automated customer invoice generation, tax reconciliation & B2B settlement ledger.
        </p>
      </div>
      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
        Zoho Books v3
      </span>
    </div>

    <form onSubmit={(e) => { e.preventDefault(); alert('Zoho Books API settings saved!'); }} className="space-y-4 text-xs font-bold">
      <div>
        <label className="text-slate-700 block mb-1">Zoho Organization ID</label>
        <input
          type="text"
          placeholder="800192837"
          defaultValue="800192837"
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
        />
      </div>

      <div>
        <label className="text-slate-700 block mb-1">Zoho Client ID</label>
        <input
          type="text"
          placeholder="1000.XXXXX..."
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
        />
      </div>

      <div>
        <label className="text-slate-700 block mb-1">Zoho Client Secret</label>
        <input
          type="password"
          placeholder="Zoho Client Secret"
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
        />
      </div>

      <div>
        <label className="text-slate-700 block mb-1">Diagnostic Healthcare GST Rate</label>
        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#0F1E36]">
          <option value="0">0% (Nil Rated - Medical Pathology Exempted under GST)</option>
          <option value="18">18% (Applicable for B2B Tech / Aggregator Commission)</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-xl shadow-md transition font-black text-xs cursor-pointer"
      >
        Save Zoho Books Credentials & Auto-Invoice Rule
      </button>
    </form>
  </div>
)}
