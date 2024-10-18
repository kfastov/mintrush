use core::traits::Into;
use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait};
use snforge_std::{start_prank, CheatTarget};

use contracts::collection::erc721::ERC721CollectionTraitSafeDispatcher;
use contracts::collection::erc721::ERC721CollectionTraitSafeDispatcherTrait;
use contracts::collection::erc721::ERC721CollectionTraitDispatcher;
use contracts::collection::erc721::ERC721CollectionTraitDispatcherTrait;

use openzeppelin::token::erc721::interface::ERC721ABISafeDispatcher;
use openzeppelin::token::erc721::interface::ERC721ABISafeDispatcherTrait;
use openzeppelin::token::erc721::interface::ERC721ABIDispatcher;
use openzeppelin::token::erc721::interface::ERC721ABIDispatcherTrait;

use openzeppelin::access::ownable::interface::IOwnableSafeDispatcher;
use openzeppelin::access::ownable::interface::IOwnableSafeDispatcherTrait;
use openzeppelin::access::ownable::interface::IOwnableDispatcher;
use openzeppelin::access::ownable::interface::IOwnableDispatcherTrait;


// Constants (will be moved in the separate file)
fn OWNER() -> ContractAddress {
    0x1.try_into().unwrap()
}
fn MINTER() -> ContractAddress {
    0x2.try_into().unwrap()
}
fn COLLECTION_NAME() -> ByteArray {
    "MyCollection"
}
fn COLLECTION_SYMBOL() -> ByteArray {
    "MC"
}
fn COLLECTION_URL() -> ByteArray {
    "https://my-collection.com/"
}

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap();

    let mut calldata = array![];
    OWNER().serialize(ref calldata);
    COLLECTION_NAME().serialize(ref calldata);
    COLLECTION_SYMBOL().serialize(ref calldata);
    COLLECTION_URL().serialize(ref calldata);

    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

#[test]
fn test_constants() {
    let contract_address = deploy_contract("ERC721Collection");

    let erc721_dispatcher = ERC721ABIDispatcher { contract_address };
    let ownable_dispatcher = IOwnableDispatcher { contract_address };

    let name = erc721_dispatcher.name();
    assert(name == COLLECTION_NAME(), 'Invalid name');

    let symbol = erc721_dispatcher.symbol();
    assert(symbol == COLLECTION_SYMBOL(), 'Invalid symbol');

    let owner = ownable_dispatcher.owner();
    assert(owner == OWNER(), 'Invalid owner');
}

#[test]
fn test_mint() {
    let contract_address = deploy_contract("ERC721Collection");

    let collection_dispatcher = ERC721CollectionTraitDispatcher { contract_address };
    let erc721_dispatcher = ERC721ABIDispatcher { contract_address };

    // change current sender to Minter
    start_prank(CheatTarget::One(contract_address), MINTER());

    // mint 1 token
    collection_dispatcher.mint();
    
    // check minter's balance
    let balance = erc721_dispatcher.balance_of(MINTER());
    assert(balance == 1, 'Invalid balance');
    // check token's owner
    let owner = erc721_dispatcher.owner_of(0);
    assert(owner == MINTER(), 'Invalid owner');
    // check token's uri
    let uri = erc721_dispatcher.token_uri(0);
    let expected_uri = format!("{}{}", COLLECTION_URL(), 0);
    println!("uri: {}", uri);
    assert(uri == expected_uri, 'Invalid uri');
}
// #[test]
// #[feature("safe_dispatcher")]
// fn test_cannot_increase_balance_with_zero_value() {
//     let contract_address = deploy_contract("HelloStarknet");

//     let safe_dispatcher = IHelloStarknetSafeDispatcher { contract_address };

//     let balance_before = safe_dispatcher.get_balance().unwrap();
//     assert(balance_before == 0, 'Invalid balance');

//     match safe_dispatcher.increase_balance(0) {
//         Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
//         Result::Err(panic_data) => {
//             assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
//         }
//     };
// }


