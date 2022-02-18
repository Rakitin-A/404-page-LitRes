$().ready(function(e) {
    var $showMoreButton = $('.show_more');
    if (has_more) {
        $showMoreButton.show();
    } else {
        $showMoreButton.hide();
    }

    $('.sort_block').find('a').click(function(e) {
        var $sortLink = $(this);
        var $sortBlock = $sortLink.parent('.sort_block');
        $('.sort_active').removeClass('sort_active');
        $sortLink.addClass('sort_active');

        var sortBy = $sortBlock.data('by');
        var sortType = ($sortLink.hasClass('sort_asc') ? 'ASC' : 'DESC');
        postData = { filter: postData.filter, searchQuery: postData.searchQuery, sortBy: sortBy, sortType: sortType };
        post('', postData, function(data) {
            $('#content_ajax').html(data.result);
            reBindEvents();
        });
        e.preventDefault();
    });


    $('.menusub').click(function(e) {
        $(this).find('.menusub').toggle();
        e.stopPropagation();
    });

    $showMoreButton.click(function(e) {
        if (typeof postData.page == "undefined") {
            postData.page = 1;
        }
        postData.page++;
        postData.lastOne = $('tr', '#content_ajax').length;

        $showMoreButton.hide();
        post('', postData, function(data) {
            $('#content_ajax').append(data.result);
            if (has_more) {
                $showMoreButton.show();
            }
            reBindEvents();
        });
        e.preventDefault();
    });

    reBindEvents();



    if ($('.filter_global').serialize().length) {
        $('.global_actions').prepend('<a href="" onclick="$(\'#filter_global\').toggle();return false;" class="filter_button"></a>');
    }
    if ($('.search_global').serialize().length) {
        $('.global_actions').prepend('<a href="" onclick="$(\'#search_global\').toggle();return false;" class="search_button"></a>');
    }
});


function reBindEvents() {

    $("#decline>input:radio").change(function () {$("#decline_submit").prop("disabled", false);});

    $('.get_item').off('click').on('click', function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        var act = $(this).data('act');
        var title = $(this).data('title');
        var postData = act ? { act: act } : {};
        console.log(link);
        Messagebox.load((link ? link : location.pathname) + '/' + id, postData, title);
        e.preventDefault();
    });

    $('.substring').each(function(k, v) {
        var text = $(this).html();
        var length = $(this).data('length');
        var textLength = text.length;

        var newText = text.substring(0, length);
        var newTextHidden = text.substring(length, textLength);
        $(this)
            .html(
                newText +
                "<span class='hidden_text' style='display: none'>" +
                newTextHidden +
                "</span>" +
                (textLength > length ? '<span class="substring_dots">...</span> (<a class="substring_show_hide small" href="">Развернуть</a>)' : '')
            )
            .removeClass('substring');
    });

    $('.item_add_box').off('click').on('click', function(e) {
        var link = $(this).data('link');
        var post = $(this).data('post');
        Messagebox.load(link ? link : '', post ? post : '', true);
        e.preventDefault();
    });

    $('.substring_show_hide').off('click').on('click', function(e) {
        if ($(this).html() == 'Развернуть') {
            $(this).html('Свернуть');
            $(this).parent().find('.substring_dots').hide();
        } else {
            $(this).html('Развернуть');
            $(this).parent().find('.substring_dots').show();
        }
        $(this).parent().find('.hidden_text').toggle();
        e.preventDefault();
    });

    $('.user_get').off('click').on('click', function(e) {
        var userId = $(this).data('id');
        Messagebox.load('/admin/users/' + userId, '', true);
        e.preventDefault();
    });

    $('.user_block').off('click').on('click', function(e) {
        var user = $(this).data('id');
        blockUsers(user);
        e.preventDefault();
    });

    $('.delete_avatar').off('click').on('click', function(e) {
        var user = $(this).data('id');
        deleteUserAvatar(user);
        e.preventDefault();
    });

    $('.user_unblock').off('click').on('click', function(e) {
        var user = $(this).data('id');
        unblockUsers(user);
        e.preventDefault();
    });

    $('.users_block').off('click').on('click', function(e) {

        var users = [];
        $('.item_check:checked').each(function(k, v) {
            users.push($(v).data('id'));
        });
        console.log(users);


        blockUsers(users);
        e.preventDefault();
    });

    $('.users_unblock').off('click').on('click', function(e) {
        var users = [];
        $('.item_check:checked').each(function(k, v) {
            users.push($(v).data('id'));
        });

        unblockUsers(users);
        e.preventDefault();
    });

    $('.chat_delete_messages').off('click').on('click', function(e) {
        var messages = [];
        $('.item_check:checked').each(function(k, v) {
            messages.push($(v).data('id'));
        });

        chatDeleteMessages(messages);
        e.preventDefault();
    });

    $('.diary_delete_comments').off('click').on('click', function(e) {
        var comments = [];
        $('.item_check:checked').each(function(k, v) {
            comments.push($(v).data('id'));
        });

        diaryDeleteComments(comments);
        e.preventDefault();
    });

    $('.delete_selected').off('click').on('click', function(e) {
        var items = [];
        $('.item_check:checked').each(function(k, v) {
            items.push($(v).data('id'));
        });

        deleteItems(items);
        e.preventDefault();
    });


    $('.genre_get').off('click').on('click', function(e) {
        var genreId = $(this).data('id');
        Messagebox.load('/admin/genres/' + genreId);
        e.preventDefault();
    });

    $('.hashtag_get').off('click').on('click', function(e) {
        var tagId = $(this).data('id');
        Messagebox.load('/admin/hashtags/' + tagId);
        e.preventDefault();
    });

    $('.ban_remove').off('click').on('click', function(e) {
        var banId = $(this).data('id');
        if (!confirm('Снять бан?')) return false;
        post('/admin/chat-ban/' + banId, { act: 'remove' }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert('Бан снят');
                updateList();
            }
        });
        e.preventDefault();
    });
    $('.row_number').each(function(k, v) {
        $(this).html('#' + (k + 1));
    });

    $('.checkbox').each(function(k, v) {
        if (!$(this).html().length) {
            $(this).html('<input type="checkbox" class="item_check" data-id="' + $(this).data('id') + '">');
        }
    });

    $('.item_check').off('change').on('change', countSelected);


    $('.accept').off('click').click(function(e) {
        var question = $(this).data('question');
        if (!confirm(question ? question : 'Утвердить?')) return false;
        var id = $(this).data('id');
        post('', { act: 'accept', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.publish').off('click').click(function(e) {
        var question =$(this).data('substring');
        if (!confirm(question ? question : 'Опубликовать отзыв?')) return false;
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'publish', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                location.reload();
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.decline').off('click').on('click', function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        var act = $(this).data('act');
        var title = $(this).data('title');
        var postData = act ? { act: act } : {};
        Messagebox.load((link ? link : location.pathname) + '/' + id, postData, title);
        e.preventDefault();
    });

    $('.delete_event').off('click').click(function(e) {
        if (!confirm('Удалить?')) return false;
        var id = $(this).data('id');
        post('/admin/events/' + id, { act: 'delete' }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                var $eventsCountObj = $('#events_count');
                $eventsCountObj.html($eventsCountObj.html() - 1);
                $('#event_' + id).remove();

                if ($eventsCountObj.html() == 0) {
                    $('.hidden_events').html('Нет новых событий');
                }
            }
        });
        e.preventDefault();
    });

    $('.activate').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'activate', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.activate_user').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'activate_user', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.disable_processing').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'disable_processing', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.enable_processing').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'enable_processing', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.delete').off('click').click(function(e) {
        if (!confirm('Удалить?')) return false;
        var id = $(this).data('id');
        var link = $(this).data('link');
        console.log(id);
        post((link ? link : ''), { act: 'delete', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                location.reload();
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.restore').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'restore', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('#filter_global').off('submit').on('submit', function(e) {

        if (!$('.filter_button').hasClass('filter_active')) {
            $('.filter_button').addClass('filter_active');
        }

        var filter = $(this).serializeJSON();

        postData.filter = filter;
        console.log(postData);

        updateList(true);
        e.preventDefault();
    });

    $('.datepicker').datetimepicker({
        format: 'd.m.Y',
        timepicker: false,
    });

    $('.datetimepicker').datetimepicker({
        format: 'Y/m/d H:i',
        timepicker: true
    });

    $('.stop').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'stop', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.stop_user').off('click').click(function(e) {
        var id = $(this).data('id');
        var link = $(this).data('link');
        post((link ? link : ''), { act: 'stop_user', id: id }, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.ban_user_by_id').off('click').click(function(e) {
        var id = $(this).data('id');
        Messagebox.load('/admin/chat', { act: 'ban_by_id', id: id });
        e.preventDefault();
    });


    $('.ban_user_by_ip').off('click').click(function(e) {
        var ip = $(this).data('ip');
        Messagebox.load('/admin/chat', { act: 'ban_by_ip', ip: ip });
        e.preventDefault();
    });

    //редактор прямо в диве(надо допилить)
    $('.editable_block').off('click').on('click', function(e) {
        if ($(this).hasClass('editable')) {
            return false;
        }
        var id = $(this).data('id');
        $(this).addClass('editable');
        $(this).html('<textarea data-id="' + id + '">' + $(this).html() + '</textarea>');
        $(this).append('<br><button>Сохранить</button>');
    });

    $('.edit_item_form').off('submit').on('submit', function(e) {
        var $form = $(this);
        var postData = $form.serialize();
        var action = $form.attr('action');
        post(action, postData, function(data) {
            if (data.error) {
                alert('Ошибка');
                console.log(data);
            } else {
                alert(data.result);
                updateList();
            }
        });
        e.preventDefault();
    });

    $('.show_big_picture').off('click').on('click', function(e) {
        var id = Messagebox.create();
        Messagebox.setContent('<img src=' + $(this).attr('src') + ' style="max-width:800px;max-height:800px;display:block;margin:0 auto;">', id);
        Messagebox.show(id);

        e.preventDefault();
    });

    $('#search_global').off('submit').on('submit', function(e) {

        var query = $(this).find('.live_search').val();

        postData.searchQuery = query;
        console.log(postData);

        updateList(true);
        e.preventDefault();
    });

    $('#checkbox_all').off('click').on('click', function(e) {
        var $thisVal = $(this).prop('checked');
        $('.item_check').prop('checked', $thisVal);
        countSelected();
    });


    countSelected();
}

function chatDeleteMessages(ids) {
    if (!confirm('Удалить?')) return false;
    post('/admin/chat', { act: 'delete', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Сообщени' + (ids.length > 1 ? 'я' : 'е') + ' удален' + (ids.length > 1 ? 'ы' : 'о') + ' успешно');
            updateList();
        }
    });
}

function diaryDeleteComments(ids) {
    if (!confirm('Удалить?')) return false;
    post('/admin/diaries-comments', { act: 'delete', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Сообщени' + (ids.length > 1 ? 'я' : 'е') + ' удален' + (ids.length > 1 ? 'ы' : 'о') + ' успешно');
            updateList();
        }
    });
}

function deleteItems(ids) {
    if (!confirm('Удалить?')) return false;
    post('', { act: 'delete', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Удален' + (ids.length > 1 ? 'ы' : 'о') + ' успешно');
            updateList();
        }
    });
}

function deleteUsersAvatar(ids) {
    if (!confirm('Удалить аватар?')) return false;
    post('/admin/users', { act: 'delete_avatar', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Аватар удалён');
            updateList();
        }
    });
}

function blockUsers(ids) {
    if (!confirm('Заблокировать?')) return false;
    post('/admin/users', { act: 'block', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Пользователь' + (ids.length > 1 ? 'и' : 'ь') + ' заблокирован' + (ids.length > 1 ? 'ы' : '') + ' успешно');
            updateList();
        }
    });
}

function unblockUsers(ids) {
    if (!confirm('Разблокировать?')) return false;
    post('/admin/users', { act: 'unblock', id: ids }, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            alert('Пользователь' + (ids.length > 1 ? 'и' : 'ь') + ' разблокирован' + (ids.length > 1 ? 'ы' : '') + ' успешно');
            updateList();
        }
    });
}

function updateList(refresh) {
    postData.page = 1;
    postData.lastOne = (!refresh ? $('tr', '#content_ajax').length : 0);

    $('.show_more').hide();
    post('', postData, function(data) {
        if (data.error) {
            alert('Ошибка');
            console.log(data);
        } else {
            $('#content_ajax').html(data.result);
            reBindEvents();
            if (has_more) {
                $('.show_more').show();
            }
        }
    });
}

function setResultCounters(resultsShow, resultsTotal, resultsMore) {
    $('#global_counter').html('Показано ' + resultsShow + ' из ' + resultsTotal);
    $('.show_more').html('Загрузить ещё ' + resultsMore);
}

function countSelected() {
    var selectedCnt = $('.item_check:checked').length;
    if (selectedCnt > 0) {
        $('.floating_actions').show();
    } else {
        $('.floating_actions').hide();
    }
    $('.count_selected').html(selectedCnt);

    $('.unselect_all').off('click').on('click', function(e) {
        $('.item_check:checked').click();
        $('#checkbox_all').prop('checked', false);
        e.preventDefault();
    });
}