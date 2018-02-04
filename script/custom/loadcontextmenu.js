function loadContextMenu(){   

var contextMenu = `<ul id="side-menu" class="nav">
				<div class="clearfix"></div>`;
			jQuery.getJSON("context_menu.json",
					function(data) {
					  	var menus = data;
					  	var menuArray = menus.menu_items;
					  	for (var menu in menuArray) {
							var subContextItems = menuArray[menu].childs;
							if(subContextItems != null){
								var menuId = "submenu"+menu;
								contextMenu += `<li><a href="#" id="btn-1" data-toggle="collapse"
									data-target="#`+menuId+`" aria-expanded="false"><i
									class="fa fa-tachometer fa-fw">
										<div class="icon-bg bg-orange"></div>
								</i><span class="menu-title">`+menuArray[menu].name+`</a>
								<ul class="nav collapse" id="`+menuId+`" role="menu"
									aria-labelledby="btn-1">
									<li><a></a></li>`;
								for (var item in subContextItems) {
									contextMenu += `<li><a href="retrieve?item=` +
										subContextItems[item].value
					  				+`">`+ subContextItems[item].name +`</a></li>`
								}
								contextMenu += "</ul>";
							} else {
								contextMenu += `<li><a onclick="updateMarkers('` +
									menuArray[menu].value
					  				+`');"><i class="`+menuArray[menu].icon+`">
									<div class="icon-bg bg-primary"></div>
									</i><span class="menu-title">` 
									+ menuArray[menu].name +
									`</span></a>`;
							}
							contextMenu += "</li>";
					  	}
					  	contextMenu += "</ul>";
					  	document.getElementById("context-menu").innerHTML = contextMenu;
				});
}