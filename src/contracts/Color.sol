// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
  string[] public colors; // create an array to store colors
  mapping(string => bool) _colorExists; // checks if passed in color exists

  constructor() ERC721("Color", "COLOR") public {
  }

  function mint(string memory _color) public { // normally assigned to a minter not public
    require(!_colorExists[_color]); // requires that color doesn't already exist in the mapping
    colors.push(_color); // if it doesn't exist then pushes to colours array
    uint256 _id = colors.length; // assign unique id to color
    _mint(msg.sender, _id); // mint the new color token
    _colorExists[_color] = true; // assign thetoken to true
  }

}