use core::traits::Into;
use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait};

use contracts::collection::erc721::ERC721CollectionTraitSafeDispatcher;
use contracts::collection::erc721::ERC721CollectionTraitSafeDispatcherTrait;
use contracts::collection::erc721::ERC721CollectionTraitDispatcher;
use contracts::collection::erc721::ERC721CollectionTraitDispatcherTrait;

use openzeppelin::token::erc721::interface::IERC721MetadataSafeDispatcher;
use openzeppelin::token::erc721::interface::IERC721MetadataSafeDispatcherTrait;
use openzeppelin::token::erc721::interface::IERC721MetadataDispatcher;
use openzeppelin::token::erc721::interface::IERC721MetadataDispatcherTrait;

// Constants (will be moved in the separate file)
fn OWNER() -> ContractAddress {
    0x1.try_into().unwrap()
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

    let erc721_dispatcher = IERC721MetadataDispatcher { contract_address };

    let name = erc721_dispatcher.name();
    assert(name == COLLECTION_NAME(), 'Invalid name');

    let symbol = erc721_dispatcher.symbol();
    assert(symbol == COLLECTION_SYMBOL(), 'Invalid symbol');
}

#[test]
#[ignore]
fn test_mint() {
    let collection_dispatcher = ERC721CollectionTraitDispatcher { contract_address };
    collection_dispatcher.mint();
    // TODO more tests
// let balance_before = dispatcher.get_balance();
// assert(balance_before == 0, 'Invalid balance');

// dispatcher.increase_balance(42);

// let balance_after = dispatcher.get_balance();
// assert(balance_after == 42, 'Invalid balance');
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


