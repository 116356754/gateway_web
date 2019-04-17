$(function() {
    if (self.parent.vm.$i18n.locale == 'zh-CN') {
        $('#runtype').combobox({
            url: '../static/json/runtype.json',
            onChange(newValue, oldValue) {
                if (newValue == 'start') {
                    document.getElementById("jstime_div").style.display = 'none';
                    document.getElementById("jscycle_div").style.display = 'none';
                } else if (newValue == 'timer') {
                    document.getElementById("jstime_div").style.display = 'none';
                    document.getElementById("jscycle_div").style.display = '';
                } else if (newValue == 'cron') {
                    document.getElementById("jstime_div").style.display = '';
                    document.getElementById("jscycle_div").style.display = 'none';
                }
            }
        });
    } else {   
        $('#runtype').combobox({
            url: '../static/json/runtype_english.json',
            onChange(newValue, oldValue) {
                if (newValue == 'start') {
                    document.getElementById("jstime_div").style.display = 'none';
                    document.getElementById("jscycle_div").style.display = 'none';
                } else if (newValue == 'timer') {
                    document.getElementById("jstime_div").style.display = 'none';
                    document.getElementById("jscycle_div").style.display = '';
                } else if (newValue == 'cron') {
                    document.getElementById("jstime_div").style.display = '';
                    document.getElementById("jscycle_div").style.display = 'none';
                }
            }
        });
    }

    $('#func_tree').tree({
        url: '../static/json/func_tree.json',
        onClick: function(row) {
            var level = easyui_tree_options.getLevel(this, row);
            if (level == 1) {
                $("#func_document").val("");
            } else if (level == 2) {
                $("#func_document").val(row.document);
                $("#func_preview").textbox("setValue", row.function);
                if (row.function == 'Sleep()') {
                    document.getElementById("read_tag_div").style.display = 'none';
                } else {
                    document.getElementById("read_tag_div").style.display = '';
                }
            }
        }
    });

    $('#read_tag').textbox({
        onClickButton: function() {
            button_name = 'read_tag';
            display_tag('js_script', 'read_tag', true)
        },
        onChange(newValue, oldValue) {
            func_tree_select = $('#func_tree').tree("getSelected");
            $("#func_preview").textbox("setValue", func_tree_select.functag.format(newValue));
        }
    });
})

// 在光标后加入文本
function insertAtCursor(textDom, value) {
    var selectRange;
    var startPos = textDom.selectionStart;
    var endPos = textDom.selectionEnd;
    var scrollTop = textDom.scrollTop;
    textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
    textDom.focus();
    textDom.selectionStart = startPos + value.length;
    textDom.selectionEnd = startPos + value.length;
    textDom.scrollTop = scrollTop;
}

// 将预览的代码插入到js脚本当中
function insert_js() {
    preview = $("#func_preview").textbox("getValue");
    // $("#js_preview").val(preview);
    insertAtCursor(document.getElementById('js_preview'), preview)
}