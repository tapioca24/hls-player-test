import videojs, { VideoJsPlayer } from "video.js";

declare module "video.js" {
  namespace VideoJsPlaylist {
    interface Item {
      sources: string | videojs.Tech.SourceObject | videojs.Tech.SourceObject[];
      poster?: string;
      textTracks?: TextTrackList;
      [key: string]: any;
    }
  }
  interface VideoJsPlayer {
    playlist: {
      /**
       * Get/set the playlist for a player.
       *
       * This function is added as an own property of the player and has its
       * own methods which can be called to manipulate the internal state.
       *
       * @param  [newList]
       *         If given, a new list of sources with which to populate the
       *         playlist. Without this, the function acts as a getter.
       *
       * @param  [newIndex]
       *         If given, the index of the item in the list that should
       *         be loaded first. If -1, no video is loaded. If omitted, The
       *         the first video is loaded.
       *
       * @return The playlist
       */
      (
        newList?: VideoJsPlaylist.Item[],
        newIndex?: number
      ): VideoJsPlaylist.Item[];

      /**
       * Get the index of the current item in the playlist. This is identical to
       * calling `currentItem()` with no arguments.
       *
       * @return The current item index.
       */
      currentItem(index?: number): number;

      /**
       * Checks if the playlist contains a value.
       *
       * @param  value
       *         The value to check
       *
       * @return The result
       */
      contains(
        value: string | videojs.Tech.SourceObject[] | VideoJsPlaylist.Item
      ): boolean;

      /**
       * Gets the index of a value in the playlist or -1 if not found.
       *
       * @param  value
       *         The value to find the index of
       *
       * @return The index or -1
       */
      indexOf(
        value: string | videojs.Tech.SourceObject[] | VideoJsPlaylist.Item
      ): number;

      /**
       * Get the index of the current item in the playlist. This is identical to
       * calling `currentItem()` with no arguments.
       *
       * @return The current item index.
       */
      currentIndex(): number;

      /**
       * Get the index of the last item in the playlist.
       *
       * @return The index of the last item in the playlist or -1 if there are no
       *         items.
       */
      lastIndex(): number;

      /**
       * Get the index of the next item in the playlist.
       *
       * @return The index of the next item in the playlist or -1 if there is no
       *         current item.
       */
      nextIndex(): number;

      /**
       * Get the index of the previous item in the playlist.
       *
       * @return The index of the previous item in the playlist or -1 if there is
       *         no current item.
       */
      previousIndex(): number;

      /**
       * Plays the first item in the playlist.
       *
       * @return Returns undefined and has no side effects if the list is empty.
       */
      first(): VideoJsPlaylist.Item | undefined;

      /**
       * Plays the last item in the playlist.
       *
       * @return Returns undefined and has no side effects if the list is empty.
       */
      last(): VideoJsPlaylist.Item | undefined;

      /**
       * Plays the next item in the playlist.
       *
       * @return Returns undefined and has no side effects if on last item.
       */
      next(): VideoJsPlaylist.Item | undefined;

      /**
       * Plays the previous item in the playlist.
       *
       * @return Returns undefined and has no side effects if on first item.
       */
      previous(): VideoJsPlaylist.Item | undefined;

      /**
       * Set up auto-advance on the playlist.
       *
       * @param  [delay]
       *         The number of seconds to wait before each auto-advance.
       */
      autoadvance(delay?: number): void;

      /**
       * Sets `repeat` option, which makes the "next" video of the last video in
       * the playlist be the first video in the playlist.
       *
       * @param  [val]
       *         The value to set repeat to
       *
       * @return The current value of repeat
       */
      repeat(val?: boolean): boolean;

      /**
       * Sorts the playlist array.
       *
       * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
       * @fires playlistsorted
       *
       * @param compare
       *        A comparator function as per the native Array method.
       */
      sort(
        compare: (a: VideoJsPlaylist.Item, b: VideoJsPlaylist.Item) => number
      ): void;

      /**
       * Reverses the playlist array.
       *
       * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
       * @fires playlistsorted
       */
      reverse(): void;

      /**
       * Shuffle the contents of the list randomly.
       *
       * @link https://github.com/lodash/lodash/blob/40e096b6d5291a025e365a0f4c010d9a0efb9a69/shuffle.js
       * @fires playlistsorted
       * @todo  Make the `rest` option default to `true` in v5.0.0.
       * @param [options]
       *        An object containing shuffle options.
       *
       * @param [options.rest = false]
       *        By default, the entire playlist is randomized. However, this may
       *        not be desirable in all cases, such as when a user is already
       *        watching a video.
       *
       *        When `true` is passed for this option, it will only shuffle
       *        playlist items after the current item. For example, when on the
       *        first item, will shuffle the second item and beyond.
       */
      shuffle(options?: { rest?: boolean }): void;
    };
  }
}
