CREATE DATABASE finance_manager_ces26
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

create schema db;

/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*-----------------------------------USERS----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
drop table users;
create table users(
    id_user serial Primary Key not null,
    password varchar(50) NULL,
    account_type char not null,
    name varchar(40) not null,
    email varchar(40) not null UNIQUE,
    status char,
    id_comfirm int null unique,
    id_comfirm_route varchar(10) null UNIQUE
);

create or replace function check_user_validation() returns TRIGGER as '
declare
    begin
        raise notice ''id = %'', new.id_user;
        if new.account_type = ''S'' then
            if new.password is null then
                raise exception ''when user doesnt use auth account it need a password'';
                return null;
            end if;
        elsif not(new.account_type = ''F'' OR new.account_type = ''G'') then
                raise exception ''when user is not STANDARD it need to use google or facebook'';
                return null;
        end if;
        if new.status is null then
            new.status := ''0'';
        end if;
      RETURN new;

    end;
' language plpgsql;

create trigger register_user before insert or update on users
 for each row execute procedure check_user_validation();



/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/

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

