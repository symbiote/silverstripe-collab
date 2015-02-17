<?php

class TimelineIntranetExtension extends Extension {

	public function onAfterInit(){
		Requirements::javascript('themes/ssau-minimalist/js/modernizr.js');
		Requirements::javascript('themes/ssau-minimalist/js/foundation.min.js');
	}

}