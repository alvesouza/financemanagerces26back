drop table tags cascade;
drop table expenses cascade ;
drop table users cascade ;

/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*-----------------------------INDEPENDENT FUNCTIONS------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/

create or replace function generate_string(num int)
returns text
    as
    $$
        declare
            chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,' ||
                            '       V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
            result text = '';
            i int := 0;
        begin
            if num < 0 then
                raise exception 'num has to be bigger than zero';
            end if;
            for i in 1..num loop
                result := result || chars[1+random()*(array_length(chars, 1)-1)];
              end loop;
            return result;
        end;
    $$ language plpgsql;


/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*-----------------------------------USERS----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
create table users(
    id_user serial not null,
    Primary Key(id_user),
--     login varchar(20) NULL UNIQUE,
    password varchar(80) NULL,
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
            new.id_comfirm_route := generate_string(10);
        end if;
      RETURN new;

    end;
' language plpgsql;

create trigger register_user before insert or update on users
 for each row execute procedure check_user_validation();

create or replace function create_id_validation(email_user text default null, id_from_user int default null) returns bool
    as
    $$
        declare
            id_validation text;
            status_user char;
        begin

            if id_from_user is null and email_user is not null then
                if email_user is not null then
                    select id_from_user = id_user, status_user = users.status from users where
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

/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*------------------------------------TAGS----------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/

create table tags(
    id_tag SERIAL PRIMARY KEY,
    id_user SERIAL NOT NULL,
    CONSTRAINT id_user
                 FOREIGN KEY(id_user)
                    references users(id_user) on delete cascade on update cascade,
    tag VARCHAR(20) NOT NULL,
    unique(id_user, tag)
);
-- drop index tags_tag_idx;
create INDEX
    concurrently tags_tag_idx
    on
        tags
            using hash(tag);

create INDEX
    concurrently tags_user_idx
    on
        tags
            using hash(id_user);
create or replace VIEW tags_tag_view AS
    select * from tags order by tag asc, id_user asc, id_tag asc;


/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*----------------------------------EXPENSES--------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
-- drop table expenses
create table expenses(
    id_expense SERIAL PRIMARY KEY,
    id_user SERIAL NOT NULL,
    description VARCHAR(50),
    id_tag int NULL,
    paid BOOLEAN NOT NULL default false,
    value REAL NOT NULL,
    date DATE null,
    reminderCreated DATE NULL,
    paid_day DATE NULL,
    CONSTRAINT id_user
        FOREIGN KEY(id_user)
            references users(id_user) on delete cascade on update cascade
--     CONSTRAINT id_tag
--         FOREIGN KEY(id_tag)
--             references tags(id_tag)
);
-- ALTER TABLE expenses
-- ADD COLUMN date DATE null;
-- drop index expenses_date_idx;
create INDEX
    concurrently expenses_date_idx
    on
        expenses
            using btree(date);
drop view expenses_tag_order_user_id;
create or replace VIEW expenses_tag_order_user_id AS
    SELECT expenses.id_user as id_user,
           expenses.id_expense as id_expense,
           tags.tag as tag,
           expenses.description as description,
           expenses.paid as paid,
           expenses.value as value,
           expenses.date as date,
           expenses.reminderCreated as reminderCreated,
           expenses.paid_day as paid_day
    FROM expenses
    LEFT JOIN tags on tags.id_tag = expenses.id_tag
    order by id_user asc,
             id_expense asc;

create or replace function create_expenses_tag_order_user_id_function() returns TRIGGER
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
            insert into expenses (id_user, description, value,paid, reminderCreated, paid_day, date, id_tag)
                            values (new.id_user, new.description, new.value, new.paid, new.reminderCreated,
                                                                            new.paid_day, new.date, id_tag_var);

            return new;
        end;
    $$ language plpgsql;

create or replace function update_expenses_tag_order_user_id_function() returns TRIGGER
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
            update expenses
                set id_user = new.id_user,
                    description = new.description,
                    value = new.value, paid = new.paid,
                    reminderCreated = new.reminderCreated,
                    paid_day = new.paid_day,
                    date = new.date,
                    id_tag = id_tag_var
                where id_user = new.id_user and id_expense = new.id_expense;

            return new;
        end;
    $$ language plpgsql;

-- drop trigger create_expenses_tag_order_user_id on expenses_tag_order_user_id;
create trigger create_expenses_tag_order_user_id instead of insert on expenses_tag_order_user_id
 for each row execute procedure create_expenses_tag_order_user_id_function();

create trigger update_expenses_tag_order_user_id instead of update on expenses_tag_order_user_id
 for each row execute procedure update_expenses_tag_order_user_id_function();

-- create or replace function before_expenses_tag_order_user_id_function() returns TRIGGER
--     as
--     $$
--         begin
--             if(new.paid is null) then
--                 new.paid := false;
--             end if;
--         end;
--     $$ language plpgsql;
-- create trigger before_expenses_tag_order_user_id before insert or update on expenses_tag_order_user_id
--  for each row execute procedure before_expenses_tag_order_user_id_function();