<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Sheets.js</title>

	<link rel="stylesheet" href="../dist/css/sheets.min.css">
	<link rel="stylesheet" href="../dist/css/sheets.paper-theme.css">
</head>
<body>


	<?php
	if ( isset( $_POST['submit'] ) ) {
		foreach ( $_POST as $key => $post ) {
			echo "<pre>";
			    var_dump( "$key => " . html_entity_decode( $post ) );
			echo "</pre>";
		}
	}
	 ?>

	<div class="wrapper">
		<style>
			div.wrapper {
				margin: 4rem;
			}
		</style>
		<form action="" method="POST">

			<div class="editor-module">
				<div class="toolbar">
					<div class="toolset">
						<div class="toolbar-dropdown">
							<button type="button" class="btn btn-link toolbar-item dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-header">&nbsp;</i>Text Format</button>
							<div class="toolbar-dropdown-menu">
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h1">Heading 1</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h2">Heading 2</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h3">Heading 3</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h4">Heading 4</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h5">Heading 5</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="h6">Heading 6</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="p">Paragraph</a>
								<a role="option" class="toolbar-dropdown-option" data-command="formatBlock" data-command-value="pre">pre formatting</a>
							</div>
						</div>

						<div class="toolbar-dropdown">
							<button type="button" class="btn btn-link toolbar-item dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-header">&nbsp;</i>Size Format</button>
							<div class="toolbar-dropdown-menu">
								<a role="option" class="toolbar-dropdown-option" data-command="sizeFormat" data-command-value="small">small</a>
								<!-- <a role="option" class="toolbar-dropdown-option active" data-command="sizeFormat" data-command-value="normal">Normal</a> -->
								<a role="option" class="toolbar-dropdown-option" data-command="sizeFormat" data-command-value="big">Big</a>
							</div>
						</div>
					</div>
					<div class="toolset">
						<button type="button" class="btn btn-link toolbar-item" data-command="dropcap" title="Drop cap"><i class="icon-header"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="bold"><i class="icon-bold"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="italic"><i class="icon-italic"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="underline"><i class="icon-underline"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="strikethrough"><i class="icon-strikethrough"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="formatBlock" data-command-value="p"><i class="icon-clear-formatting"></i></button>
					</div>
					<div class="toolset">
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyLeft"><i class="icon-paragraph-left"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyCenter"><i class="icon-paragraph-center"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-paragraph-right"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyFull"><i class="icon-paragraph-justify"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="indent"><i class="icon-indent-increase"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="outdent"><i class="icon-indent-decrease"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="rtl" title="Right to Left"><i class="icon-rtl"></i></button>
					</div>
					<div class="toolset">
						<button type="button" class="btn btn-link toolbar-item" data-command="cut"><i class="icon-scissors"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="copy"><i class="icon-copy"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="paste"><i class="icon-paste"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="undo" title="Undo"><i class="icon-undo"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="redo" title="Redo"><i class="icon-redo"></i></button>
					</div>
					<div class="toolset">
						<button type="button" class="btn btn-link toolbar-item" data-command="insertorderedlist"><i class="icon-list-numbered"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="insertunorderedlist"><i class="icon-list-bulletted"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="formatBlock" data-command-value="blockquote"><i class="icon-quotes-left"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="createlink"><i class="icon-link"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyCenter"><i class="icon-unlink"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="insertHtml" data-command-value="<hr>"><i class="icon-horizontal-rule"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-stats-dots"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-formula-x"></i></button>
					</div>
					<div class="toolset">
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-books"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-camera"></i></button>
						<button type="button" class="btn btn-link toolbar-item" data-command="justifyRight"><i class="icon-images"></i></button>
					</div>

				</div>

				<?php
				// Simulates data coming from database,
				// assume the data is saved with htmlentities,
				// we decode and store to $content
				$content = isset($_POST['content']) ? $_POST['content'] : html_entity_decode("&lt;h1&gt;Joomla Guru Pro&lt;/h1&gt;&lt;pre&gt;{score:1,total:5}&lt;/pre&gt;");
				// $content = html_entity_decode("<pre>{score:1,total:5}</pre>");
				?>
				<textarea id="editor" name="content" data-editor><?php echo $content ?></textarea>

				<div class="toolbar">
					<div class="toolset">
						<div class="toolbar-dropdown">
							<button type="button" class="btn btn-link toolbar-item dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-document-add-alt">&nbsp;</i>Add Layout</button>
							<div class="toolbar-dropdown-menu">
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns twelve">12 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns six">6 Column</a>
								</div>
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns eleven">11 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns one">1 Column</a>
								</div>
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns ten">10 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns two">2 Column</a>
								</div>
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns nine">9 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns three">3 Column</a>
								</div>
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns eight">8 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns four">4 Column</a>
								</div>
								<div class="dropdown-row">
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns seven">7 Column</a>
									<a role="option" class="toolbar-dropdown-option" data-command="addSection" data-command-value="columns five">5 Column</a>
								</div>
							</div>
						</div>
						<!-- <button type="button" class="btn btn toolbar-item" data-command="addRow">Add Row</button> -->
					</div>
				</div>
			</div>
			<br>
			<br>
			<button type="submit" name="submit">Submit</button>
		</form>

		<h1>Long text to copy</h1>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem facilis, qui explicabo. Nemo soluta et maiores, olore saepe dolorem porro ea in similique nesciuntobcaecati earum, aut error ad odio labore reiciendis voluptatem laboriosam nostrum nam quo impedit. Dolorum rem amet repellendus nostrum nam harum quod eius nulla ecessitatibus libero a impedit, ullam velit alias repudiandae perspiciatis.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem facilis, qui explicabo. Nemo soluta et maiores, olore saepe dolorem porro ea in similique nesciuntobcaecati earum, aut error ad odio labore reiciendis voluptatem laboriosam nostrum nam quo impedit. Dolorum rem amet repellendus nostrum nam harum quod eius nulla ecessitatibus libero a impedit, ullam velit alias repudiandae perspiciatis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem facilis, qui explicabo. Nemo soluta et maiores, olore saepe dolorem porro ea in similique nesciuntobcaecati earum, aut error ad odio labore reiciendis voluptatem laboriosam nostrum nam quo impedit. Dolorum rem amet repellendus nostrum nam harum quod eius nulla ecessitatibus libero a impedit, ullam velit alias repudiandae perspiciatis.</p>

	</div>
	<script src="../src/js/sheets.js"></script>
</body>
</html>