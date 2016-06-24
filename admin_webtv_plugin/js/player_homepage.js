
$(document).ready(function(){
    var index_bdd_precedent;















    var myPlaylist = new jPlayerPlaylist({
        jPlayer: "#player_video",
        cssSelectorAncestor: "#container_jplayer"
    }, [

    ],  {
        playlistOptions: {
            enableRemoveControls: true,
            autoPlay: true,
            keyEnabled: true,
        },
        //swfPath: "../../dist/jplayer",
        supplied: "webmv, ogv, m4v, oga, mp3",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        audioFullScreen: true,

    });
    /*   myPlaylist.setPlaylist([
        {
            title:"Big Buck Bunny Trailer",
            artist:"artiste",
            m4v:"http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
            ogv:"http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
            webmv: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm",
            poster:"http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png"
        },
        {
            title:"Finding Nemo Teaser",
            artist:"Pixar",
            m4v: "http://www.jplayer.org/video/m4v/Finding_Nemo_Teaser.m4v",
            ogv: "http://www.jplayer.org/video/ogv/Finding_Nemo_Teaser.ogv",
            webmv: "http://www.jplayer.org/video/webm/Finding_Nemo_Teaser.webm",
            poster: "http://www.jplayer.org/video/poster/Finding_Nemo_Teaser_640x352.png"
        },
        {
            title:"Incredibles Teaser",
            artist:"Pixar",
            m4v: "http://www.jplayer.org/video/m4v/Incredibles_Teaser.m4v",
            ogv: "http://www.jplayer.org/video/ogv/Incredibles_Teaser.ogv",
            webmv: "http://www.jplayer.org/video/webm/Incredibles_Teaser.webm",
            poster: "http://www.jplayer.org/video/poster/Incredibles_Teaser_640x272.png"
        }
    ]);


/*
*/

    /*
    *       Generer des playlists
    */
    /*
*  Requête Ajax pour générer des playlists à volonté.
*/


    /** REQUETE AJAX WORDPRESS
*
*   le terme action:'mon_action' refere à la fonction qui est effectué quand la requete ajax se fait (ici on recupere les url,titre,artiste de la playlist)
*
*   le terme url: ajaxurl  est le chemin vers le fichier qui recupere les requete ajax
*
*
*/



    var tableau_donnees= new Array();

    $.ajax({
        url: ajaxurl, 
        data:{
            'action':'recuperer_videos_player_page_principale',
        },
        dataType: 'JSON',
        success: function(data) {
                  //  console.log(data);
           $.each(data.data, function(index, value) {
               
               
          //On va récupérer le nom de l'artiste pour chaque titre
               var artiste;
               var title=value.titre;
               $.post(
                   ajaxurl,
                   {
                       'action': 'recuperer_artiste_with_title',
                       'title': title,
                   },
                   function(response){
                      // console.log(response);
                       
                       artiste=response.data;
                       console.log(artiste);
                       myPlaylist.add({
                           title:value.titre,
                           artist:artiste,
                           m4v:value.url
                       });
                   }
               ); 
                console.log(value.url);
    
                  
               myPlaylist.play();
            });
         
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });



    /*--------------------------------------- Règles internes --------------------------------------------------*/

    var bool2=false;
    var bool3=false;
    var videonepasrepasser;
    var artisteanepasrepasser;

    //Fonction pour effacer les morceaux au fur et à mesure
    jQuery("#player_video").bind(jQuery.jPlayer.event.ended, function (event)
                                 {   
        var current         = myPlaylist.current,
            playlist        = myPlaylist.playlist;

        myPlaylist.remove(current-1);

        //On efface le morceau de la base de donnée également
        var titre_current_track=myPlaylist.playlist[myPlaylist.current].title;
        $.post(
            ajaxurl,
            {
                'action': 'effacer_video_jouee_player',
                'videocourante':titre_current_track-1
            },
            function(response){
                console.log(response);
            }
        ); 

    });

   
    
    // Ne pas repasser le meme morceaux + meme artiste

    jQuery("#player_video").bind(jQuery.jPlayer.event.timeupdate, function (event){  


        var current         = myPlaylist.current,
            playlist        = myPlaylist.playlist;


        jQuery.each(playlist, function (index, obj){

            if (obj.title==event.jPlayer.status.media.title && index<current+19 && index!=current && bool2 ==false && index !=0 ){
                bool2=true;
                videonepasrepasser=index;          
            } 
        });
        if(bool2==true ){
            bool2=false; 
            // var s=videonepasrepasser-current;
            //console.log('video a ne pas repasser en position '+videonepasrepasser+' soit dans  '+s+' vidéos');
            myPlaylist.remove(videonepasrepasser);
        }

        else{


            if(playlist.length>10){
                var art;
                var titr;
                var lien;
                jQuery.each(playlist, function (index, obj){
                    if (obj.artist==event.jPlayer.status.media.artist && index<current+4 && index!=current && index !=0 && index<playlist.length-5 ){

                        artisteanepasrepasser=index;
                        bool3=true;
                        art=obj.artist;
                        titr=obj.title;
                        lien=obj.m4v;
                    }
                });
                if(bool3==true){
                    // console.log('Artiste a ne pas repasser au '+artisteanepasrepasser+'  ');
                    bool3=false;
                    myPlaylist.remove(artisteanepasrepasser);
                    myPlaylist.add({
                        title:titr,
                        artist:art,
                        m4v:lien

                    });

                }
            } 
        }


    });
    /*-------------------------------------- FIN Règles internes ---------------------------------------------*/



});
