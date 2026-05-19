revoke execute on function public.redeem_shakas_for_purchase(uuid, integer, text, text) from public, anon, authenticated;
revoke execute on function public.unlock_with_shakas(uuid, integer, text, text) from public, anon, authenticated;
grant execute on function public.redeem_shakas_for_purchase(uuid, integer, text, text) to service_role;
grant execute on function public.unlock_with_shakas(uuid, integer, text, text) to service_role;