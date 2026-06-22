import { FaPaperPlane } from "react-icons/fa";

export default function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  sendError,
  onRetry,
  disabled,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !sending && !disabled) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !sending && !disabled) {
        onSend();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 shrink-0 shadow-xs"
    >
      <div className="grow relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled
              ? "Sélectionnez une discussion pour commencer..."
              : "Votre message (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)..."
          }
          className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:bg-white border border-slate-100/50 focus:border-transparent transition-all min-h-[46px] max-h-[120px] resize-none scrollbar-thin disabled:opacity-60 disabled:cursor-not-allowed"
          rows={1}
        />
        {sendError && onRetry && (
          <span className="absolute right-3 top-2 text-[10px] text-red-500 flex items-center gap-1">
            {sendError}
            <button
              type="button"
              onClick={onRetry}
              className="underline font-bold text-[#10b981] hover:text-[#0b9062] border-none bg-transparent cursor-pointer"
            >
              Réessayer
            </button>
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!value.trim() || sending || disabled}
        className="p-3.5 h-[46px] rounded-2xl bg-[#10b981] hover:bg-[#0b9062] active:scale-[0.97] disabled:bg-[#10b981] text-white transition-all cursor-pointer shadow-md shadow-emerald-500/10 shrink-0 border-none flex items-center justify-center"
        aria-label="Envoyer le message"
      >
        <FaPaperPlane size={13} className={sending ? "animate-pulse" : ""} />
      </button>
    </form>
  );
}
