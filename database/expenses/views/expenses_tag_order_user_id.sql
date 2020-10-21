drop view expenses_tag_order_user_id;
create or replace VIEW expenses_tag_order_user_id AS
    SELECT expenses.id_user as id_user,
           expenses.id_expense as id_expense,
           tags.tag as tag,
           expenses.description as description,
           expenses.paid as paid,
           expenses.value as value,
           expenses.reminderCreated as reminderCreated,
           expenses.paid_day as paid_day
    FROM expenses
    LEFT JOIN tags on tags.id_tag = expenses.id_tag
    order by id_user asc,
             id_expense asc;


select * from expenses_tag_order_user_id