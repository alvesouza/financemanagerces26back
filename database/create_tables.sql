/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*-----------------------------------USERS----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
drop table users;
create table users(
    id_user serial Primary Key not null,
    login varchar(20) NULL UNIQUE,
    password varchar(50) NULL,
    account_type char not null,
    name varchar(40) not null,
    email varchar(40) not null UNIQUE,
    status char,
    id_comfirm_route varchar(10) null
);
-- select data_part('day number', current_date)
-- select extract(dow from  current_date)
create or replace function check_user_validation() returns TRIGGER as '
declare
    begin
        raise notice ''id = %'', new.id_user;
        if new.account_type = ''S'' then
            if new.login is null then
                raise exception ''when user doesnt use auth account it need a login'';
            elsif new.password is null then
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