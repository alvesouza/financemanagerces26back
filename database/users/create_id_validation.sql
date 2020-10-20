create or replace function create_id_validation(email_user text default null, id_from_user int default null) returns bool
    as
    $$
        declare
            id_validation text;
            status_user char;
        begin

            if id_from_user is null and email_user is not null then
                if email_user is not null then
                    select id_from_user := id_user, status_user := users.status from users where
                                                                users.email = email_user fetch first 1 rows only;
                    if id_from_user is null then
                        raise exception 'create_id_validation received email that does not belong to the database';
                    end if;
                    if status_user = 'V' then
                        raise notice 'User already validated';
                        return false;
                    end if;
                else
                    raise exception 'should receive valid email_user or id_from_user';
                end if;
            end if;

            id_validation := generate_string(10);

            while (select id_user from users where
                                    users.id_comfirm_route = id_validation fetch first 1 rows only ) is not null loop
                id_validation := generate_string(10);
                end loop;

            update users
            set id_comfirm_route = id_validation,
                status = '0'
            where id_user = id_from_user;
            return true;
        end;
    $$ language plpgsql;
-- update users
-- set status = 'E'
-- where id_user = 2
-- select create_id_validation(id_from_user => 2);
--
--
-- select generate_string(10)