/**
 * Created by Administrator on 2017/10/26.
 */
function parseINIString(data) {
    var regex = {
        section: /^\s*\s*([^]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/\r\n|\r|\n/);
    var section = null;
    lines.forEach(function(line) {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length == 0 && section) {
            section = null;
        }
    });
    return value;
}

function set_mac(ip_value) {
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_mac',
        timeout: 5000,
        success: function(data) {
            data = JSON.parse(data);
            if (ip_value == 'ETH0') {
                $('#mac').textbox({
                    value: data.mac[0]
                });
            } else {
                $('#mac').textbox({
                    value: data.mac[1]
                });
            }
        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
        }
    });
}


function ajax_setip(eth, dhcp, ip, netmask, gwy, ipstr, dnsstr) {
    gwip = get_baseurl();
    if (eth == 'ETH0') {
        data = {
            "eth": "eth0",
            "dhcp": dhcp,
            "ip": ip,
            "netmask": netmask,
            "gateway": gwy,
            "ipstr": ipstr,
            "dnsstr": dnsstr,
            "ippath": "/etc/net.conf",
            "dnspath": "/etc/resolv.conf"
        }
        $.ajax({
            type: 'post',
            url: 'http://' + gwip + '/set_ipconfig',
            data: data,
            timeout: 5000,
            success: function(data) {
                if (data["result"]) {
                    parent.insert_info(self.parent.messages[initial]['system']['eth0_success']);
                } else {
                    parent.insert_info(self.parent.messages[initial]['system']['eth0_fail']);
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], data, "info")
                }
            },
            error: function() {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
            }
        });
    } else {
        data = {
            "eth": "eth1",
            "dhcp": dhcp,
            "ip": ip,
            "netmask": netmask,
            "gateway": gwy,
            "ipstr": ipstr,
            "dnsstr": dnsstr,
            "ippath": "/etc/net2.conf",
            "dnspath": "/etc/resolv.conf"
        }
        $.ajax({
            type: 'post',
            url: 'http://' + gwip + '/set_ipconfig',
            data: data,
            timeout: 5000,
            success: function(data) {
                if (data["result"]) {
                    parent.insert_info(self.parent.messages[initial]['system']['eth1_success']);
                } else {
                    parent.insert_info(self.parent.messages[initial]['system']['eth1_fail']);
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], data, "info")
                }
            },
            error: function() {
                $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
            }
        });
    }
}

function ip_ftp() {
    if ($('#ip_form').form('validate')) {
        dhcp = $("#dhcp").switchbutton("options").checked;
        eth = document.getElementById('eh').value;
        ip = document.getElementById('ip').value;
        netmask = document.getElementById('netmask').value;
        gwy = document.getElementById('gwy').value;
        dns1 = document.getElementById('dns1').value;
        dns2 = document.getElementById('dns2').value;
        ipstr = "IPADDR=" + ip + '\n';
        ipstr += "NETMASK=" + netmask + '\n';
        ipstr += "GATEWAY=" + gwy + '\n';
        ipstr += "DHCP=" + dhcp + '\n';
        dnsstr = 'nameserver ' + dns1 + '\n'
        dnsstr += 'nameserver ' + dns2 + '\n'

        ajax_setip(eth, dhcp, ip, netmask, gwy, ipstr, dnsstr)
    }
}

$(function() {
    value = get_baseurl();
    $.ajax({
        type: 'get',
        url: 'http://' + value + '/get_ipconfig',
        timeout: 5000,
        success: function(data) {
            if (data['net2']) {
                gwip = [{ "text": "ETH0", "selected": true }, { "text": "ETH1" }]
            } else {
                gwip = [{ "text": "ETH0", "selected": true }]
            }
            $("#eh").combobox({
                valueField: 'text',
                textField: 'text',
                data: gwip,
                panelHeight: 'auto'
            });
        },
        error: function() {
            $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
        }
    })

    $('#eh').combobox({
        onChange: function(newValue, oldValue) {
            $.ajax({
                type: 'get',
                url: 'http://' + value + '/get_ipconfig',
                timeout: 5000,
                success: function(data) {
                    if (newValue == 'ETH0') {
                        $('#ip').textbox({ value: data['net1']['IPADDR'] });
                        $('#netmask').textbox({ value: data['net1']['NETMASK'] });
                        if (data['net1']['DHCP'] == 'true') {
                            $("#dhcp").switchbutton("check");
                            $('#gwy').textbox({ value: '' });
                            $('#dns1').textbox({ value: '' });
                            $('#dns2').textbox({ value: '' });
                        } else {
                            $("#dhcp").switchbutton("uncheck");
                            $('#gwy').textbox({ value: data['net1']['GATEWAY'] });
                        }
                    } else {
                        $('#ip').textbox({ value: data['net2']['IPADDR'] });
                        $('#netmask').textbox({ value: data['net2']['NETMASK'] });
                        if (data['net2']['DHCP'] == 'true') {
                            $("#dhcp").switchbutton("check");
                            $('#gwy').textbox({ value: '' });
                            $('#dns1').textbox({ value: '' });
                            $('#dns2').textbox({ value: '' });
                        } else {
                            $("#dhcp").switchbutton("uncheck");
                            $('#gwy').textbox({ value: data['net2']['GATEWAY'] });
                        }
                    }
                    $('#dns1').textbox({ value: data['dns']['dns1'] });
                    $('#dns2').textbox({ value: data['dns']['dns2'] });
                },
                error: function() {
                    $.messager.alert(self.parent.messages[initial]['common']['system_hint'], self.parent.messages[initial]['index']['connectip_fail'].format(value), "info");
                }
            });
        }
    });

    $('#dhcp').switchbutton({
        onChange: function(checked) {
            if (checked == true) {
                $('#ip').textbox({
                    disabled: true
                });
                $('#netmask').textbox({
                    disabled: true
                });
                $('#gwy').textbox({
                    disabled: true
                });
                $('#dns1').textbox({
                    disabled: true
                });
                $('#dns2').textbox({
                    disabled: true
                });
                return;
            }
            if (checked == false) {
                $('#ip').textbox({
                    disabled: false
                });
                $('#netmask').textbox({
                    disabled: false
                });
                $('#gwy').textbox({
                    disabled: false
                });
                $('#dns1').textbox({
                    disabled: false
                });
                $('#dns2').textbox({
                    disabled: false
                });
            }
        }
    })
});