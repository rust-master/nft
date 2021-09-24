pragma solidity 0.5.0;

import "./ERC721Full.sol";

contract Emoji is ERC721Full {
  string[] public emojis;
  mapping(string => bool) _emojisExists;

  constructor() ERC721Full("Emoji", "EMOJI") public {
  }

  // E.G. color = "#FFFFFF"
  function mint(string memory _emoji) public {
    require(!_emojisExists[_emoji]);
    uint _id = emojis.push(_emoji);
    _mint(msg.sender, _id);
    _emojisExists[_emoji] = true;
  }
}