export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export const initialActionState = { ok: false, error: "" } as ActionResult;

const AUTH_ERRORS: Record<string, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme seu e-mail pelo link que enviamos antes de entrar.",
  user_already_exists: "Já existe uma conta com este e-mail.",
  email_exists: "Já existe uma conta com este e-mail.",
  weak_password: "Senha fraca: use pelo menos 8 caracteres, misturando letras e números.",
  over_email_send_rate_limit: "Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos.",
  over_request_rate_limit: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  same_password: "A nova senha precisa ser diferente da anterior.",
  signup_disabled: "Novos cadastros estão desativados neste ministério.",
};

export function translateAuthError(err: { code?: string; message?: string } | null | undefined): string {
  if (!err) return "Não foi possível concluir. Tente novamente.";
  if (err.code && AUTH_ERRORS[err.code]) return AUTH_ERRORS[err.code];
  if (err.message?.toLowerCase().includes("invalid login")) return AUTH_ERRORS.invalid_credentials;
  return "Não foi possível concluir. Verifique os dados e tente novamente.";
}

/** Mensagem amigável para erros do banco (RLS, restrições). */
export function translateDbError(err: { code?: string; message?: string } | null | undefined): string {
  if (!err) return "Erro inesperado.";
  if (err.code === "42501") return err.message && !err.message.startsWith("new row") ? err.message : "Você não tem permissão para esta ação.";
  if (err.code === "23505") return "Este registro já existe.";
  if (err.code === "23514") return "Algum valor está fora do permitido. Revise o formulário.";
  if (err.code === "23503") return "Registro relacionado não encontrado.";
  if (err.code === "P0001" && err.message) return err.message;
  return "Não foi possível salvar. Tente novamente.";
}
