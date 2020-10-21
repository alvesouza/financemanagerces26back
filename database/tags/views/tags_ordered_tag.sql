create or replace VIEW tags_tag_view AS
    select * from tags order by tag asc, id_user asc, id_tag asc;

select * from users order by id_user asc;

select * from tags_tag_view;