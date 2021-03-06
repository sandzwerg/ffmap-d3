function nodetable(table, fn) {
  var thead, tbody, tfoot

  function prepare() {
    thead = table.append("thead")
    tbody = table.append("tbody")
    tfoot = table.append("tfoot")

    var tr = thead.append("tr")

    tr.append("th").text("Name")
    tr.append("th").text("Status")
    tr.append("th").text("Clients")
    tr.append("th").text("WLAN Links")
    tr.append("th").text("VPN")
    tr.append("th").text("Geo")
    tr.append("th").text("Firmware")
    tr.append("th").text("Autoupdater")
    tr.append("th").text("Branch")
    tr.append("th").text("Hardware")
    tr.append("th").text("Load AVG")
    tr.append("th").text("RX MiB")
    tr.append("th").text("TX MiB")
  }

  function sum(arr, attr) {
    return arr.reduce(function(old, node) { return old + node[attr] }, 0)
  }

  function update(data) {
    var non_clients = data.nodes.filter(function (d) { return !d.flags.client })
    var doc = tbody.selectAll("tr").data(non_clients)
    
    var row = doc.enter().append("tr")

    row.classed("online", function (d) { return d.flags.online })
    
    row.append("td").text(function (d) { return d.name?d.name:d.id })
    row.append("td").text(function (d) { return d.flags.online?"online":"offline" })
    row.append("td").text(function (d) { return d.clients.length })
    row.append("td").text(function (d) { return d.wifilinks.length })
    row.append("td").text(function (d) { return d.vpns.length })
    row.append("td").text(function (d) { return d.geo?"ja":"nein" })
    row.append("td").text(function (d) { return d.firmware })
    row.append("td").text(function (d) { return d.autoupdater?"ja":"nein" })
    row.append("td").text(function (d) { return d.branch })
    row.append("td").text(function (d) { return d.hardware })
    row.append("td").text(function (d) { return d.loadavg })
    row.append("td").text(function (d) { return (Math.round(d.rx_bytes / 1024 / 1024)) })
    row.append("td").text(function (d) { return (Math.round(d.tx_bytes / 1024 / 1024)) })

    var foot = tfoot.append("tr")
    foot.append("td").text("Summe")
    foot.append("td").text(non_clients.reduce(function(old, node) { return old + node.flags.online }, 0) + " / " + non_clients.length)
    foot.append("td").text(non_clients.reduce(function(old, node) { return old + node.clients.length }, 0))
    foot.append("td").attr("colspan", 4).style("text-align", "right").text("Zuletzt aktualisiert: " + (new Date(data.meta.timestamp + 'Z')).toLocaleString())

    $("#list").tablesorter({sortList: [[0,0]]})
  }

  var data

  function fetch(fn) {
    load_nodes(fn, data, update)
  }


  prepare()

  fetch(fn)
}

function init() {
  table = nodetable(d3.select("#list"), ffmapConfig.nodes_json)
  adjust_navigation()
}
