/**
 * Sheets JS
 * WYSIWYG Editor for backend developers
 *
 * @param  {[type]} document [description]
 * @param  {[type]} this     [description]
 * @return {[type]}          [description]
 */
(function (document, window) {

	'use strict';

	if(document.contentEditable != undefined && document.execCommand != undefined) {
		console.log("[Sheets.js]", "HTML5 Document Editing API Is Not Supported.");
	}

	var Sheets = {
		init: function ($textarea) {
			var wrapper = document.createElement('div');
			wrapper.setAttribute('class', 'sheet-cover sheet-row');

			this.$textarea = $textarea;
			this.innerEditors = [];
			var editor = this.makeEditor();
			console.log(editor);
			wrapper.appendChild(editor);

			this.innerEditor = editor;
			this.editor = wrapper;

			return this;
		},
		makeEditor: function (columnWidth) {
			columnWidth = columnWidth ? columnWidth : 'twelve';
			// var editor = document.createElement('div');
			// editor.setAttribute('contenteditable', true);
			// editor.setAttribute('class', 'sheet-editor sheet-mode-html');
			// this.innerEditors.push(editor);
			// return editor;

			var editor = document.createElement('div');
			editor.setAttribute('contenteditable', true);
			editor.setAttribute('class', 'sheet-editor sheet-mode-html');
			this.innerEditor = editor;
			this.setContent( this.$textarea.value );

			var container = document.createElement('div');
			container.setAttribute('class', 'sheet-editor-container ' + columnWidth);

			var btn = makeButton("", "btn-close toolbar-item", "i", "icon-cross");
			btn.setAttribute("data-command", "removeSection");
			btn.addEventListener("click", function (e) {
				e.preventDefault();
				this.closest('.sheet-editor-container').remove();
			});

			var toolset = document.createElement("div");
			toolset.setAttribute("class", "sheet-header text-right");
			toolset.appendChild(btn);

			container.appendChild(toolset);
			container.appendChild(editor);

			// this.refresh();

			return container;
			// return editor;
		},
		getEditor: function () {
			return this.editor;
		},
		append: function (editor, parent) {
			parent.insertBefore(editor, this.$textarea.nextSibling);
			// parent.appendChild(editor);
			return this;
		},
		getToolsFrom: function (parent) {
			return parent.querySelectorAll('[data-command]')
		},
		tools: function (tools) {
			var _ = this;
			for (var i = tools.length - 1; i >= 0; i--) {
				var tool = tools[i];

				tool.onmousedown = function (e) {
					/**
					 * Prevent to have the
					 * non-button tags (e.g. span) still
					 * perform the click event
					 */
					e.preventDefault();
				}


				_.listen(tool, 'click change', function (e) {
					// document.designMode = "on";

					e.preventDefault();
					e.stopPropagation();

					var command = this.getAttribute('data-command');
					var commandValue = this.getAttribute('data-command-value');

					if ( commandValue == "undefined" ) {
						commandValue = null;
					}

					switch (command) {
						case "rtl":
							_.innerEditor.classList.toggle('direction-rtl');
							break;

						case "pre":
							document.execCommand(command, false, commandValue);
							document.execCommand("insertHtml", false, "<p></p>");
							break;

						case 'addSection':
							var editor = _.makeEditor(commandValue);
							_.editor.appendChild(editor);
							break;

						case 'addRow':
							var row = document.createElement("div");
							var btn = makeButton("Remove", "btn-close toolbar-item", "i", "icon-undo");
							row.setAttribute("class", "sheet-row row");
							row.appendChild(btn);
							if (window.getSelection) {
								var sel = window.getSelection();
								if (sel.getRangeAt && sel.rangeCount) {
									var range = sel.getRangeAt(0);
									range.deleteContents();
									range.insertNode( row );
								}
							} else {
								_.innerEditor.appendChild(row);
							}
							break;

						case 'dropcap':
							var elem = window.getSelection ? window.getSelection : getWord();
							document.execCommand("formatBlock", false, "p");
							var selectedElement = window.getSelection().focusNode.parentNode;
				                	selectedElement.classList.toggle('dropcap');
							break;

						case 'sizeFormat':
							if (window.getSelection) {
								surroundSelection('span', 'font-'+commandValue);
							}
				                	break;

						default:
							document.execCommand(command, false, commandValue);
							break;
					}


					// if ( "pre" == commandValue ) {
					// 	document.execCommand("insertHtml", false, "<p></p>");
					// }

					document.designMode = "off";
				});

			}

			// Listen for active buttons
			_.listen(_.innerEditor, 'keyup', function (e) {
				if (document.queryCommandState("bold")) {
					e.stopPropagation();
					var button = document.querySelectorAll('[data-command="bold"]')[0];
					var classNames = button.className;
					var newClass = classNames.concat(" active");
					button.className = newClass;
				}
			});

		},
		makeTabbable: function () {
			this.editor.onkeydown = function (e) {
				// TAB key
				if ( 9 === e.keyCode ) {
					document.execCommand('insertHTML', false, "&#09;");
					e.preventDefault();
				}
			}
		},
		listen: function (element, events, fn) {
			events.split(' ').forEach( e => element.addEventListener(e, fn, false));
		},
		copyContentTo: function ($el) {
			// $el.value = this.innerEditor.innerHTML;
			// $el.innerHTML = this.innerEditor.innerHTML;
			var innerEditors = this.innerEditors;
			var content = "";
			[].map.call(innerEditors, function (innerEditor) {
				content += innerEditor.innerHTML;
			});
			$el.innerHTML = content; //this.innerEditor.innerHTML;
			// console.log($el.innerHTML);
		},
		setContent: function (content) {
			this.innerEditor.innerHTML = content;
			this.content = content;
		},
		getContent: function () {
			return this.content;
		}
	};

	var textareas = document.querySelectorAll('[data-editor]');

	// Dropdowns
	var toolDropdowns = document.querySelectorAll('.dropdown-toggle');
	[].map.call(toolDropdowns, function (elem) {
		elem.addEventListener("click", function () {
			var parent = this.closest(".toolbar-dropdown");
			var children = parent.children;

			// if (parent.classList)

			[].map.call(children, function (child) {
				if ( child.className.match(/toolbar-dropdown-menu/) ) {
					// var previouses = document.querySelectorAll('.toolbar-dropdown-menu.open');
					// [].map.call(previouses, function (previous) {
					// 	previous.classList.remove("open");
					// });

					child.classList.toggle('open');

					var items = child.querySelector('.toolbar-dropdown-option');
					// console.log(items);
					[].map.call(items, function (item) {
						var dropdowns = document.querySelectorAll('.toolbar-dropdown-menu');
						item.addEventListener("click", function () {
							[].map.call(dropdowns, function (dropdown) {
								dropdown.classList.remove("open");
							});
						});
					});
				}

			});

		}, false);
	});

	function surroundSelection(elem, classes) {
    		var span = document.createElement(elem);
    		span.setAttribute("class", classes)

    		if (window.getSelection) {
        		var sel = window.getSelection();
        		if (sel.rangeCount) {
            		var range = sel.getRangeAt(0).cloneRange();
            		range.surroundContents(span);
            		sel.removeAllRanges();
            		sel.addRange(range);
        		}
   		}
	}


	function getWord(cut) {
		cut = cut ? cut : true;
    		var sel, word = "";
    		if (window.getSelection && (sel = window.getSelection()).modify) {
        		var selectedRange = sel.getRangeAt(0);
        		sel.collapseToStart();
        		sel.modify("move", "backward", "word");
        		sel.modify("extend", "forward", "word");

        		word = sel.toString();
        		if ( ! cut ) {
        			selectedRange.deleteContents();
        		}

			// Restore selection
			// sel.removeAllRanges();
			// sel.addRange(selectedRange);
    		} else if ( (sel = document.selection) && sel.type != "Control") {
        		var range = sel.createRange();
        		range.collapse(true);
        		range.expand("word");
        		word = range.text;
    		}

    		return word;
	}

	function pasteHtmlAtCaret(html, selectPastedContent) {
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.createContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers (IE9, for one)
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		}
		//  else if ( (sel = document.selection) && sel.type != "Control") {
			// IE < 9
		// 	var originalRange = sel.createRange();
		// 	originalRange.collapse(true);
		// 	sel.createRange().pasteHTML(html);
		// 	if (selectPastedContent) {
		// 		range = sel.createRange();
		// 		range.setEndPoint("StartToStart", originalRange);
		// 		range.select();
		// 	}
		// }
	}

	document.addEventListener("DOMContentLoaded", function () {
		for (var i = textareas.length - 1; i >= 0; i--) {
			var $textarea = textareas[i];
			var sheets = Object.create(Sheets);

			sheets.init($textarea);
			var $editor = sheets.getEditor();

			$textarea.style.display = "none";

			var $parent = $textarea.closest(".editor-module");

			sheets.append($editor, $parent);
			sheets.makeTabbable();
			sheets.tools( sheets.getToolsFrom($parent) );

			sheets.listen($parent, 'keypress mouseup', function () {
				sheets.copyContentTo($textarea);
			});

			/**
			 * Just to make sure, also listen to when the
			 * form is being submitted
			 */
			sheets.listen($parent.closest('form'), 'submit', function () {
				sheets.copyContentTo($textarea);
			});
		}
	});

	function makeButton(text, btnClass, icon, iconClass) {
		btnClass = btnClass ? btnClass : 'btn-tool';
		icon = icon ? '<'+icon+' class="'+iconClass+'"></'+icon+'>' : '';

		var btn = document.createElement("button");
		btn.innerHTML += icon;
		btn.innerHTML += text;
		btn.setAttribute("class", btnClass);
		btn.setAttribute("type", "button");
		return btn;
	}
})(document, window);