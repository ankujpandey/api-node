const createTemplate = (res, imgRes) => {
	return `<!DOCTYPE html>
	<html>
		<head>
			<title>HTML content</title>
			<link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
		</head>
		<body>
		<div class="d-flex justify-content-center"><h1>Document</h1></div>
		<div class="card d-flex flex-row">

		<div class="card-body">
		  <h5 class="card-title"><b>Name:</b> ${res?.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
		  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
		  <a href="#" class="card-link">Card link</a>
		  <a href="#" class="card-link">Another link</a>
		</div>
		<div><img
		src="data:image/jpg;base64,${imgRes.profile_image}"
		className="img-thumbnail m-3"
		alt=""
		height="100"
		width="100"
	/></div>
	  </div>
		</body>
	</html>`;
};

module.exports = createTemplate;
