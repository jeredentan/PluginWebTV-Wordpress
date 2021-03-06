
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
        url: myAjax.ajaxurl, 
        data:{
            'action':'recuperer_videos_player_page_principale',
        },
        dataType: 'JSON',
        success: function(data) {

            $.each(data.data, function(index, value) {

                // tableau_donnees=value;
                myPlaylist.add({
                    title:value.titre,
                    artist:value.artiste,
                    m4v:value.url
                });
            });
            // myPlaylist.shuffle(true);
            myPlaylist.play();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);

            alert(thrownError);
        }
    });



    /*--------------------------------------- Règles internes --------------------------------------------------*/

    
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
                'videocourante':titre_current_track
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

*/

});
