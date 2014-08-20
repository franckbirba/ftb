angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('DoggyCtrl', function($scope, FileUploader) {
     $scope.uploader = new FileUploader();
     $scope.$watch($scope.uploader.queue, function() {
            alert('hey, myVar has changed!');
        });
     $scope.uploader.queue
  
})
.controller('DoggyListCtrl', function($scope, $http) {
    $http({method: 'GET', url: 'http://localhost:4242/img'}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data);
          $scope.doggyList = data;
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
  /*$scope.doggyList = [
    { url: 'http://th07.deviantart.net/fs71/200H/i/2012/322/a/3/obvious_doggystyle_joke_by_mkbuster-d5lektv.png', id: 1 ,text:"Inserting a gerbil into my vibration station got me flooding tuna tunnel tears faster than a greased weasel shit. He munched on my meaty hangers, even though I'd been up on bricks for the best part of a week. With my spam castanets now much like that bathroom door in The Shining, he thought it was time to start sliding my marmite motorway. Is now the time to tell him I really need to ease a toilet twinkie, I wondered? I awoke the next morning with my gashtray still oozing. I thought it was over but his flesh gordon had other ideas. The hammering of my balloon knot was so vigorous, he soon found his love spuds joining his batter blaster deep in my poop chute."},
    { url: 'http://s3.amazonaws.com/rapgenius/stick-figure-sex-doggystyle.jpg', id: 2 ,text:"He copped a giant colon cobra on my chest puppies just so he could suck it up like a bulldog eating porridge. I can't wait to devour the baby gravy from his spunk-filled spam rocket. The mixture of corn-eyed butt snake and gentleman's relish in my soft tight anus created the delicious rectal stew that he was so fond of. By now, my bearded haddock pasty was weeping like someone had poured fairy liquid into Niagara Falls. With my velcro triangle now much like a manatee in yoga pants, he thought it was time to start stuffing my chocolate starfish. Is now the time to tell him I really need to launch a footlong fudge bullet, I wondered?"},
    { url: 'http://www.meemes.com/sites/default/files/styles/galleria_zoom-copy/public/doggy-style-hyena-mating.jpg?itok=-3KU-sKb', id: 3 , text:"With my clap flaps now much like John Wayne's saddlebags, he thought it was time to start shoving my old dirt road. Is now the time to tell him I really need to roll a corn-eyed butt snake, I wondered? Now, I've seen more action than Helmand Province, but the sight of his sperminator made my minge mucus dribble like a slug in a salt mine. I can't wait to devour the gentleman's relish from his spam dagger. The seemingly never-ending streams of Da Vinci load emanating from his cervix cigar soon had me coated like a plasterer's radio. The feeling of his ectoplasm dripping down my throat got my tuna tunnel tears flowing quicker than greased shit off a shiny shovel."},
    { url: 'http://i1.trekearth.com/photos/96740/amores_perros.jpg', id: 4 , text:"The unrelenting orgasms from his tallywacker hammering my one slice toaster made me come so hard, I began sweating like a fat slag in a disco. I can't wait to consume the Da Vinci load from his tenderloin truncheon. He pitched a giant Mr. Hanky on my chest puppies just so he could lap it up like a bulldog eating porridge. Inserting my fist into my frilling pink golf bag got me spritzing fallopian fish stock faster than greased shit off a shiny shovel. The raiding of my shit winker was so vigorous, he soon found his chin pounders joining his throbbing quim dagger deep in my turd-herder."},
    { url: 'http://www.meemes.com/sites/default/files/styles/galleria_zoom-copy/public/doggy-style-panda-mating.jpg?itok=8YWjyUoc', id: 5 , text:"With my furburger now much like that bathroom door in The Shining, he thought it was time to start stuffing my shit winker. Is now the time to tell him I really need to launch a toilet twinkie, I wondered? The seemingly never-ending streams of love mayonnaise emanating from his giggle stick soon had me coated like a plasterer's radio. My mouth was so full of purple beaver buster and man fat, the gentleman's relish was draining down my chin and onto my chesticles. By now, my birth cannon was haemorrhaging like a jizz waterfall. If I don't audition the finger puppets to get my fallopian fish stock foaming from my hot pocket, his blood-engorged mayonnaise cannon is going to leave my piss flaps resembling a darts team's goalkeeper."},
    { url: 'http://i46.tinypic.com/34rzmue.jpg', id: 6, text:"The slamming of my Mavis Fritter was so vigorous, he soon found his man marbles joining his muffbuster deep in my turd cutter. My south mouth was trembling like an epileptic at a Pink Floyd concert. With his skeleton king thrusting deep into my fuck trench, the sensation of his pink tractor beam smashing my cervix made me quiver like jelly. He crowned a giant Mr. Hanky on my rack just so he could chow down on it up like a hungry hungry hippo. I can't wait to gobble the Da Vinci load from his devil's bagpipe." }
  ];*/
})

.controller('PlaylistsCtrl', function($scope) {

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('EditCtrl', function($scope, $stateParams) {
    $scope.filter1 = function(){
        var img = document.getElementById("editImg"); // get the image element

        if (img.complete) {	// make sure the image is fully loaded
        	var newimg = Pixastic.process(
        		img,
        		"brightness",	// brightness/contrast adjustment

        		{		// options object

        			"brightness" : 60,	// set brightness option value to 60
        			"contrast" : 0.5,	// set contrast option value to 0.5,
        			"rect" : {		// apply the effect to this region only
        				"left" : 100,
        				"right" : 100,
        				"width" : 200,
        				"height" : 150
        			}
        		}
        	)
        }
    };
        
    function doTest(test) {
        var img = document.getElementById("original-image"),
            canvas = document.getElementById("output-canvas"),
            ctx = canvas.getContext("2d"),
            progress = document.getElementById("progress-inner"),
            P;

        canvas.style.display = "none";
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.title = test.effect;
        ctx.drawImage(img, 0, 0);
        P = new Pixastic(ctx, "lib/pixastic/");
        P[test.effect](test.options).done(function() {
            canvas.style.display = "block";
        }, function(p) {
            progress.style.height = (p * 100) + "%";
        });
    }
    
    var tests = [
        {
            effect : "posterize",
            options : {
                levels : 5
            }
        }, {
            effect : "solarize"
        }, {
            effect : "colorfilter",
            options : {
                r : 0,
                g : 194 / 255,
                b : 177 / 255,
                luminosity : 0
            }
        }, {
            effect : "findedges"
        }, {
            effect : "emboss",
            options : {
                amount : 0.5,
                angle : 135 / 180 * Math.PI
            }
        }, {
            effect : "edgeenhance3x3"
        }, {
            effect : "edgeenhance5x5"
        }, {
            effect : "sharpen3x3",
            options : {
                strength : 0.5
            }
        }, {
            effect : "sharpen5x5",
            options : {
                strength : 0.1
            }
        }, {
            effect : "soften3x3"
        }, {
            effect : "soften5x5"
        }, {
            effect : "laplace3x3"
        }, {
            effect : "laplace5x5"
        }, {
            effect : "crossedges",
            options : {
                strength : 0.5
            }
        }, {
            effect : "coloradjust",
            options : {
                r : 0,
                g : 0.3,
                b : 0
            }
        }, {
            effect : "blur",
            options : {
                kernelSize : 5
            }
        },{
            effect : "glow",
            options : {
                kernelSize : 5,
                amount : 1.0
            }
        }, {
            effect : "hsl",
            options : {
                hue : -0.8,
                saturation : 0.5,
                lightness : -0.3
            }
        },{
            effect : "fliph"
        },{
            effect : "flipv"
        },{
            effect : "desaturate"
        },{
            effect : "brightness",
            options : {
                brightness : -1.00,
                contrast : -0.1
            }
        },{
            effect : "sepia", 
        },{
            effect : "invert",
        },{
            effect : "noise",
            options : {
                amount : 0.5,
                strength : 0.5,
                mono : true
            }
        },{
            effect : "removenoise"
        },{
            effect : "lighten",
            options : {
                amount : 0.5
            }
        }
    ];
    
    var ul = document.getElementById("testlist"),
        li;
    
    for (var i=0;i<tests.length;i++) {
        li = document.createElement("li");
        li.innerHTML = tests[i].effect;
        li.setAttribute("data-test", i);
        ul.appendChild(li);
    }
    
    ul.addEventListener("click", function(e) {
        
        var target = e.target || e.srcElement,
            test;
        if (target.tagName == "LI") {
            test = tests[target.getAttribute("data-test")];
            doTest(test);
        }
    }, false);
});