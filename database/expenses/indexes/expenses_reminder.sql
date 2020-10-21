create INDEX
    concurrently expenses_date_idx
    on
        expenses
            using btree(reminderCreated)