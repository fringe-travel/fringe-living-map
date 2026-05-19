
revoke execute on function public.send_shakas(uuid, uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.credit_shaka_purchase(uuid, integer, text, text) from public, anon, authenticated;
