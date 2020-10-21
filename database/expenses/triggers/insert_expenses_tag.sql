create or replace function change_expenses_tag_order_user_id_function() returns TRIGGER
    as
    $$
        declare
            id_tag_var int;
        begin
            id_tag_var = (select tags_tag_view.id_tag from
                        tags_tag_view where tags_tag_view.tag = new.tag
                                and tags_tag_view.id_user = new.id_user fetch first 1 rows only);
            if (id_tag_var is null) then
                insert into tags_tag_view (id_tag,id_user, tag) values (default,new.id_user, new.tag)
                returning id_tag into id_tag_var;

--                 id_tag_var = (select tags_tag_view.id_tag from
--                         tags_tag_view where tags_tag_view.tag = new.tag
--                                 and tags_tag_view.id_user = new.id_user fetch first 1 rows only);
            end if;
            if(new.paid is null) then
                new.paid := false;
            end if;
            insert into expenses (id_user, description, value,paid, reminderCreated, paid_day, id_tag)
                            values (new.id_user, new.description, new.value, new.paid, new.reminderCreated,
                                                                            new.paid_day, id_tag_var);

            return new;
        end;
    $$ language plpgsql;

create trigger change_expenses_tag_order_user_id instead of insert or update on expenses_tag_order_user_id
 for each row execute procedure change_expenses_tag_order_user_id_function();