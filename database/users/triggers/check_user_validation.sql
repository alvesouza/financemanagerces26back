
create or replace function check_user_validation() returns TRIGGER as '
declare
    begin
        raise notice ''id = %'', new.id_user;
        if new.account_type = ''S'' then
            if new.login is null then
                raise exception ''when user doesnt use auth account it need a login'';
            end if;
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

