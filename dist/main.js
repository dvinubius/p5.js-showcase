const frame = document.getElementById('single-sketch');
const star = document.querySelector('.star-img');
let docStyle;
let sideBarSmall;
let sideBarTotal;

// sidebar minimized?
let sidebarSmall;

window.onload = function() {
	const docEl = document.documentElement;
	docStyle = docEl.style;
	sideBarSmall = +window.getComputedStyle(docEl).getPropertyValue('--sidebar-small');
	sideBarTotal = +window.getComputedStyle(docEl).getPropertyValue('--sidebar-total');

	sidebarSmall = false;
	toggleSidebar();
}

function toggleSidebar() {
	sidebarSmall = !sidebarSmall;

	const minimizedVal = -1 * sideBarTotal + sideBarSmall;
	const translateVal = sidebarSmall ? minimizedVal : 0;

	docStyle.setProperty('--translate-sidebar', translateVal);

	if (sidebarSmall) {
		star.classList.remove('rotated');
	} else {
		star.classList.add('rotated');
	}
}

function navigateTo(id) {
	switch (id) {
		case '0-intro':
			frame.src = "./0-intro/index.html";
			break;
		case '1-cube-webGL':
		  frame.src = "./1-cube-webGL/index.html";
			break;
		case '2-fade-paint':
		  frame.src = "./2-fade-paint/index.html";
			break;
		case '3-noise-symmetry':
		  frame.src = "./3-noise-symmetry/index.html";
			break;
		case '4-map-color':
		  frame.src = "./4-map-color/index.html";
			break;
		case '5-tiles-1':
		  frame.src ="./5-tiles-1/index.html";
			break;
		case '6-tiles-2':
		  frame.src = "./6-tiles-2/index.html";
			break;
		case '7-tiles-3':
		  frame.src = "./7-tiles-3/index.html";
			break;
		case '8-tiles-4':
		  frame.src = "./8-tiles-4/index.html";
			break;
	}

	toggleSidebar();
}