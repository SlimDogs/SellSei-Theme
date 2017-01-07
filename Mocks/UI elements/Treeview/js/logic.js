$('.oa-tree-view .checkable').click(function() {
	var checked = $(this).hasClass('checked');
	var parentLevels = $(this).parents('.sub-trees').length;
	$(this).toggleClass('checked');
});

$('.oa-tree-view .collapsable').click(function() {
	var container = $(this).parent().parent().parent();
	var collapsed = container.hasClass('collapsed');

	if (collapsed) {
		container.removeClass('collapsed');
	}
	else {
		container.addClass('collapsed');
	}
});