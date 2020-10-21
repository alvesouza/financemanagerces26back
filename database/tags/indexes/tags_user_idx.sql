create INDEX
    concurrently tags_user_idx
    on
        tags
            using hash(id_user);