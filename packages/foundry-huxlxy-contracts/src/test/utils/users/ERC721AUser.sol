// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import {ERC721TokenReceiver} from "solmate/tokens/ERC721.sol";
import {ERC721A} from "../../../ERC721A.sol";

contract ERC721AUser is ERC721TokenReceiver {
    ERC721A token;

    constructor(ERC721A _token) {
        token = _token;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public virtual override returns (bytes4) {
        return ERC721TokenReceiver.onERC721Received.selector;
    }

    function approve(address spender, uint256 tokenId) public virtual {
        token.approve(spender, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual {
        token.setApprovalForAll(operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual {
        token.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual {
        token.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public {
        token.safeTransferFrom(from, to, tokenId, data);
    }
}