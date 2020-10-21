-- drop index tags_tag_idx;
create INDEX
    concurrently tags_tag_idx
    on
        tags
            using hash(tag);